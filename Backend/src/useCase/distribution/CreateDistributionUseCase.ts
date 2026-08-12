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
    if (!dto.recipientId && !dto.recipientEmail) {
      throw new BadRequestError('Either recipient ID or recipient email is required');
    }

    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestError('At least one item line is required for distribution');
    }

    let recipient = null;
    if (dto.recipientId) {
      recipient = await this.recipientRepository.findById(dto.recipientId);
    }
    if (!recipient && dto.recipientEmail) {
      recipient = await this.recipientRepository.findByEmail(dto.recipientEmail.trim().toLowerCase());
    }

    if (!recipient) {
      throw new NotFoundError('Recipient family or agency not found in database');
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
      const currentYear = now.getUTCFullYear();
      const currentMonth = now.getUTCMonth() + 1; // 1-indexed

      const alreadyReceivedThisMonth = await this.distributionRepository.sumMonthlyUnitsByRecipientId(
        recipient.id!,
        currentYear,
        currentMonth
      );

      const quota = recipient.monthlyQuota || 50;
      if (alreadyReceivedThisMonth + newRequestTotalUnits > quota) {
        const remainingQuota = Math.max(0, quota - alreadyReceivedThisMonth);
        throw new BadRequestError(
          `Monthly family quota exceeded. Family has used ${alreadyReceivedThisMonth} of ${quota} units this month (${remainingQuota} units remaining). Requesting ${newRequestTotalUnits} units exceeds the limit.`,
          'MONTHLY_QUOTA_EXCEEDED'
        );
      }
    }

    // Generate unique distribution number (DST-XXX)
    const count = await this.distributionRepository.count();
    let distributionNumber = `DST-${(count + 101).toString().padStart(3, '0')}`;
    const existing = await this.distributionRepository.findById(distributionNumber);
    if (existing) {
      distributionNumber = `DST-${(count + 101).toString().padStart(3, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const distribution = new Distribution({
      distributionNumber,
      recipientId: recipient.id!,
      recipientName: recipient.name,
      recipientType: recipient.type,
      items: itemsList,
      status: 'pending',
      createdBy: {
        id: creator?.id || 'unknown',
        name: creator?.name || 'Handout Coordinator'
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
