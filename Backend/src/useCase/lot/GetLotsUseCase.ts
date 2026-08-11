import { ILotRepository } from '../../domain/interface/repositoryInterface/ILotRepository';
import { LotFilterDTO, LotResponseDTO } from '../../domain/interface/DTOs/LotDTO';

export interface IGetLotsUseCase {
  execute(filter?: LotFilterDTO): Promise<{
    lots: LotResponseDTO[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
}

export class GetLotsUseCase implements IGetLotsUseCase {
  constructor(private readonly lotRepository: ILotRepository) {}

  async execute(filter?: LotFilterDTO): Promise<{
    lots: LotResponseDTO[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = filter?.page || 1;
    const limit = filter?.limit || 20;

    const { lots, total } = await this.lotRepository.findAll(filter);

    const lotDTOs: LotResponseDTO[] = lots.map((lot) => ({
      id: lot.id!,
      lotNumber: lot.lotNumber,
      itemName: lot.itemName,
      category: lot.category,
      quantity: lot.quantity,
      availableQuantity: lot.availableQuantity,
      unit: lot.unit,
      receivedDate: lot.receivedDate.toISOString(),
      printedExpiryDate: lot.printedExpiryDate ? lot.printedExpiryDate.toISOString() : undefined,
      safetyMarginDays: lot.safetyMarginDays,
      effectiveExpiryDate: lot.effectiveExpiryDate ? lot.effectiveExpiryDate.toISOString() : undefined,
      donationId: lot.donationId,
      donationLineId: lot.donationLineId,
      donorName: (lot as any).donorName,
      donorType: (lot as any).donorType,
      status: lot.status,
      createdBy: lot.createdBy,
      createdAt: lot.createdAt ? lot.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: lot.updatedAt ? lot.updatedAt.toISOString() : new Date().toISOString()
    }));

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      lots: lotDTOs,
      total,
      page,
      limit,
      totalPages
    };
  }
}
