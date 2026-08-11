"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreviewFEFOUseCase = void 0;
const Lot_1 = require("../../domain/entities/Lot");
const AppError_1 = require("../../shared/errors/AppError");
class PreviewFEFOUseCase {
    distributionRepository;
    lotRepository;
    constructor(distributionRepository, lotRepository) {
        this.distributionRepository = distributionRepository;
        this.lotRepository = lotRepository;
    }
    async execute(distributionId) {
        const distribution = await this.distributionRepository.findById(distributionId);
        if (!distribution) {
            throw new AppError_1.NotFoundError('Distribution with provided ID was not found');
        }
        const now = new Date();
        const itemAllocations = [];
        let totalRequestedUnits = 0;
        let totalAllocatedUnits = 0;
        // Retrieve all shelved lots sorted by effectiveExpiryDate ascending
        const { lots: shelvedLots } = await this.lotRepository.findAll({
            status: Lot_1.LotStatus.SHELVED,
            sortBy: 'effectiveExpiryDate',
            sortOrder: 'asc',
            limit: 1000
        });
        for (const item of distribution.items) {
            totalRequestedUnits += item.requestedQuantity;
            let remainingToAllocate = item.requestedQuantity;
            const lotAllocations = [];
            // Filter eligible lots for this item:
            // 1. itemName matches (case insensitive)
            // 2. availableQuantity > 0
            // 3. status === SHELVED
            // 4. effectiveExpiryDate > now (Never reserve expired stock!)
            const candidateLots = shelvedLots.filter((lot) => {
                if (lot.status !== Lot_1.LotStatus.SHELVED)
                    return false;
                if (lot.availableQuantity <= 0)
                    return false;
                if (lot.itemName.trim().toLowerCase() !== item.itemName.trim().toLowerCase())
                    return false;
                // Central expiry rule: effective expiry date must be in the future
                if (lot.effectiveExpiryDate && new Date(lot.effectiveExpiryDate) <= now) {
                    return false;
                }
                return true;
            });
            // Sort candidate lots: earliest effective expiry first
            candidateLots.sort((a, b) => {
                if (a.effectiveExpiryDate && b.effectiveExpiryDate) {
                    return new Date(a.effectiveExpiryDate).getTime() - new Date(b.effectiveExpiryDate).getTime();
                }
                if (a.effectiveExpiryDate)
                    return -1;
                if (b.effectiveExpiryDate)
                    return 1;
                return 0;
            });
            for (const lot of candidateLots) {
                if (remainingToAllocate <= 0)
                    break;
                const takeQuantity = Math.min(lot.availableQuantity, remainingToAllocate);
                remainingToAllocate -= takeQuantity;
                lotAllocations.push({
                    lotId: lot.id,
                    lotNumber: lot.lotNumber,
                    itemName: lot.itemName,
                    allocatedQuantity: takeQuantity,
                    unit: item.unit,
                    printedExpiryDate: lot.printedExpiryDate ? lot.printedExpiryDate.toISOString() : undefined,
                    safetyMarginDays: lot.safetyMarginDays,
                    effectiveExpiryDate: lot.effectiveExpiryDate ? lot.effectiveExpiryDate.toISOString() : undefined
                });
            }
            const itemAllocated = item.requestedQuantity - remainingToAllocate;
            totalAllocatedUnits += itemAllocated;
            itemAllocations.push({
                itemName: item.itemName,
                requestedQuantity: item.requestedQuantity,
                allocatedQuantity: itemAllocated,
                unit: item.unit,
                isFulfilled: remainingToAllocate === 0,
                allocations: lotAllocations
            });
        }
        return {
            distributionId: distribution.id,
            distributionNumber: distribution.distributionNumber,
            recipientName: distribution.recipientName,
            recipientType: distribution.recipientType,
            items: itemAllocations,
            totalRequestedUnits,
            totalAllocatedUnits,
            isFullyFulfilled: totalAllocatedUnits === totalRequestedUnits
        };
    }
}
exports.PreviewFEFOUseCase = PreviewFEFOUseCase;
