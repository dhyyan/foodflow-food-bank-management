"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetLotByIdUseCase = void 0;
const AppError_1 = require("../../shared/errors/AppError");
class GetLotByIdUseCase {
    lotRepository;
    constructor(lotRepository) {
        this.lotRepository = lotRepository;
    }
    async execute(id) {
        const lot = await this.lotRepository.findById(id);
        if (!lot) {
            throw new AppError_1.NotFoundError(`Lot with identifier '${id}' was not found`);
        }
        return {
            id: lot.id,
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
            donorName: lot.donorName,
            donorType: lot.donorType,
            status: lot.status,
            createdBy: lot.createdBy,
            createdAt: lot.createdAt ? lot.createdAt.toISOString() : new Date().toISOString(),
            updatedAt: lot.updatedAt ? lot.updatedAt.toISOString() : new Date().toISOString()
        };
    }
}
exports.GetLotByIdUseCase = GetLotByIdUseCase;
