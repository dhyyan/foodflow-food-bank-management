import { IDistributionRepository } from '../../domain/interface/repositoryInterface/IDistributionRepository';
import { IReservationRepository } from '../../domain/interface/repositoryInterface/IReservationRepository';
import { DistributionResponseDTO } from '../../domain/interface/DTOs/DistributionDTO';
import { NotFoundError } from '../../shared/errors/AppError';

export class GetDistributionByIdUseCase {
  constructor(
    private readonly distributionRepository: IDistributionRepository,
    private readonly reservationRepository: IReservationRepository
  ) {}

  async execute(id: string): Promise<DistributionResponseDTO> {
    const distribution = await this.distributionRepository.findById(id);
    if (!distribution) {
      throw new NotFoundError('Distribution with provided ID was not found');
    }

    const reservations = await this.reservationRepository.findByDistributionId(distribution.id!);

    return {
      id: distribution.id!,
      distributionNumber: distribution.distributionNumber,
      recipientId: distribution.recipientId,
      recipientName: distribution.recipientName,
      recipientType: distribution.recipientType,
      items: distribution.items,
      status: distribution.status,
      reservations: reservations.map((r) => ({
        id: r.id!,
        distributionId: r.distributionId,
        lotId: r.lotId,
        lotNumber: r.lotNumber,
        itemName: r.itemName,
        quantity: r.quantity,
        unit: r.unit,
        status: r.status,
        createdBy: r.createdBy,
        createdAt: r.createdAt ? r.createdAt.toISOString() : new Date().toISOString()
      })),
      createdBy: distribution.createdBy,
      notes: distribution.notes,
      reservedAt: distribution.reservedAt ? distribution.reservedAt.toISOString() : undefined,
      completedAt: distribution.completedAt ? distribution.completedAt.toISOString() : undefined,
      createdAt: distribution.createdAt ? distribution.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: distribution.updatedAt ? distribution.updatedAt.toISOString() : new Date().toISOString()
    };
  }
}
