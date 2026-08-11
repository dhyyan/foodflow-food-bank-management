import { IDistributionRepository } from '../../domain/interface/repositoryInterface/IDistributionRepository';
import { IReservationRepository } from '../../domain/interface/repositoryInterface/IReservationRepository';
import { DistributionFilterDTO, DistributionResponseDTO } from '../../domain/interface/DTOs/DistributionDTO';

export class GetDistributionsUseCase {
  constructor(
    private readonly distributionRepository: IDistributionRepository,
    private readonly reservationRepository: IReservationRepository
  ) {}

  async execute(filter?: DistributionFilterDTO): Promise<{ distributions: DistributionResponseDTO[]; total: number }> {
    const { distributions, total } = await this.distributionRepository.findAll(filter);

    const result = await Promise.all(
      distributions.map(async (dist) => {
        const reservations = await this.reservationRepository.findByDistributionId(dist.id!);
        return {
          id: dist.id!,
          distributionNumber: dist.distributionNumber,
          recipientId: dist.recipientId,
          recipientName: dist.recipientName,
          recipientType: dist.recipientType,
          items: dist.items,
          status: dist.status,
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
          createdBy: dist.createdBy,
          notes: dist.notes,
          reservedAt: dist.reservedAt ? dist.reservedAt.toISOString() : undefined,
          completedAt: dist.completedAt ? dist.completedAt.toISOString() : undefined,
          createdAt: dist.createdAt ? dist.createdAt.toISOString() : new Date().toISOString(),
          updatedAt: dist.updatedAt ? dist.updatedAt.toISOString() : new Date().toISOString()
        };
      })
    );

    return {
      distributions: result,
      total
    };
  }
}
