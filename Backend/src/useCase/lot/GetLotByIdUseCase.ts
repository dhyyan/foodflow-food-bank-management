import { ILotRepository } from '../../domain/interface/repositoryInterface/ILotRepository';
import { LotResponseDTO } from '../../domain/interface/DTOs/LotDTO';
import { NotFoundError } from '../../shared/errors/AppError';

export interface IGetLotByIdUseCase {
  execute(id: string): Promise<LotResponseDTO>;
}

export class GetLotByIdUseCase implements IGetLotByIdUseCase {
  constructor(private readonly lotRepository: ILotRepository) {}

  async execute(id: string): Promise<LotResponseDTO> {
    const lot = await this.lotRepository.findById(id);

    if (!lot) {
      throw new NotFoundError(`Lot with identifier '${id}' was not found`);
    }

    return {
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
    };
  }
}
