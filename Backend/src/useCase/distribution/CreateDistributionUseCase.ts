import { IDistributionRepository } from '../../domain/interface/repositoryInterface/IDistributionRepository';
import { IRecipientRepository } from '../../domain/interface/repositoryInterface/IRecipientRepository';
import { Distribution } from '../../domain/entities/Distribution';
import { CreateDistributionDTO, DistributionResponseDTO } from '../../domain/interface/DTOs/DistributionDTO';
import { BadRequestError, NotFoundError } from '../../shared/errors/AppError';

export class CreateDistributionUseCase {
  constructor(
    private readonly distributionRepository: IDistributionRepository,
    private readonly recipientRepository: IRecipientRepository
  ) {}

  async execute(dto: CreateDistributionDTO, creator: { id: string; name: string }): Promise<DistributionResponseDTO> {
    if (!dto.recipientId) {
      throw new BadRequestError('Recipient ID is required');
    }

    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestError('At least one item line is required for distribution');
    }

    const recipient = await this.recipientRepository.findById(dto.recipientId);
    if (!recipient) {
      throw new NotFoundError('Recipient with provided ID was not found');
    }

    // Calculate total requested units in this distribution
    let newRequestTotalUnits = 0;
    const itemsList = dto.items.map((item) => {
      if (!item.itemName || !item.itemName.trim()) {
        throw new BadRequestError('Item name is required for all requested items');
      }
      if (!item.requestedQuantity || item.requestedQuantity <= 0) {
        throw new BadRequestError(`Invalid requested quantity for ${item.itemName}`);
      }
      newRequestTotalUnits += item.requestedQuantity;
      return {
        itemName: item.itemName.trim(),
        requestedQuantity: item.requestedQuantity,
        unit: item.unit ? item.unit.trim() : 'units'
      };
    });

    // Check family 50-unit monthly quota
    if (recipient.type === 'family') {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1; // 1-indexed

      const alreadyReceivedThisMonth = await this.distributionRepository.sumMonthlyUnitsByRecipientId(
        recipient.id!,
        currentYear,
        currentMonth
      );

      const quota = recipient.monthlyQuota || 50;
      if (alreadyReceivedThisMonth + newRequestTotalUnits > quota) {
        const remainingQuota = Math.max(0, quota - alreadyReceivedThisMonth);
        throw new BadRequestError(
          `Monthly family quota exceeded. ${remainingQuota} units remaining for this month.`,
          'MONTHLY_QUOTA_EXCEEDED'
        );
      }
    }

    // Generate distribution number (DST-XXX)
    const count = await this.distributionRepository.count();
    const distributionNumber = `DST-${(count + 101).toString().padStart(3, '0')}`;

    const distribution = new Distribution({
      distributionNumber,
      recipientId: recipient.id!,
      recipientName: recipient.name,
      recipientType: recipient.type,
      items: itemsList,
      status: 'pending',
      createdBy: {
        id: creator.id,
        name: creator.name
      },
      notes: dto.notes
    });

    const saved = await this.distributionRepository.create(distribution);

    return {
      id: saved.id!,
      distributionNumber: saved.distributionNumber,
      recipientId: saved.recipientId,
      recipientName: saved.recipientName,
      recipientType: saved.recipientType,
      items: saved.items,
      status: saved.status,
      createdBy: saved.createdBy,
      notes: saved.notes,
      createdAt: saved.createdAt ? saved.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: saved.updatedAt ? saved.updatedAt.toISOString() : new Date().toISOString()
    };
  }
}
