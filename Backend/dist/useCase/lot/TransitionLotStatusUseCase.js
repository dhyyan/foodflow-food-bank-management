"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransitionLotStatusUseCase = void 0;
const Lot_1 = require("../../domain/entities/Lot");
const LotEvent_1 = require("../../domain/entities/LotEvent");
const AppError_1 = require("../../shared/errors/AppError");
class TransitionLotStatusUseCase {
    lotRepository;
    lotEventRepository;
    constructor(lotRepository, lotEventRepository) {
        this.lotRepository = lotRepository;
        this.lotEventRepository = lotEventRepository;
    }
    async execute(lotId, dto, userId, userName, userRole) {
        const lot = await this.lotRepository.findById(lotId);
        if (!lot) {
            throw new AppError_1.NotFoundError(`Lot with identifier '${lotId}' was not found`);
        }
        const currentStatus = lot.status;
        const targetStatus = dto.targetStatus;
        if (currentStatus === targetStatus) {
            throw new AppError_1.BadRequestError(`Lot is already in '${currentStatus}' status`);
        }
        // Validate state machine transitions
        const isValidTransition = this.validateTransition(currentStatus, targetStatus);
        if (!isValidTransition) {
            throw new AppError_1.BadRequestError(`Invalid status transition from '${currentStatus}' to '${targetStatus}'. Please verify the inspection and shelving workflow rules.`);
        }
        // Update lot status
        const updatedLot = await this.lotRepository.updateStatus(lot.id, targetStatus);
        if (!updatedLot) {
            throw new Error(`Failed to update status for Lot #${lot.lotNumber}`);
        }
        // Determine event type
        const eventType = this.determineEventType(currentStatus, targetStatus);
        // Save audit event
        const eventEntity = new LotEvent_1.LotEvent({
            lotId: lot.id,
            eventType,
            previousStatus: currentStatus,
            newStatus: targetStatus,
            performedBy: {
                id: userId,
                name: userName,
                role: userRole
            },
            notes: dto.notes || `Status changed from ${currentStatus} to ${targetStatus}`,
            timestamp: new Date()
        });
        await this.lotEventRepository.create(eventEntity);
        return {
            id: updatedLot.id,
            lotNumber: updatedLot.lotNumber,
            itemName: updatedLot.itemName,
            category: updatedLot.category,
            quantity: updatedLot.quantity,
            availableQuantity: updatedLot.availableQuantity,
            unit: updatedLot.unit,
            receivedDate: updatedLot.receivedDate.toISOString(),
            printedExpiryDate: updatedLot.printedExpiryDate ? updatedLot.printedExpiryDate.toISOString() : undefined,
            safetyMarginDays: updatedLot.safetyMarginDays,
            effectiveExpiryDate: updatedLot.effectiveExpiryDate ? updatedLot.effectiveExpiryDate.toISOString() : undefined,
            donationId: updatedLot.donationId,
            donationLineId: updatedLot.donationLineId,
            donorName: updatedLot.donorName || lot.donorName,
            donorType: updatedLot.donorType || lot.donorType,
            status: updatedLot.status,
            createdBy: updatedLot.createdBy,
            createdAt: updatedLot.createdAt ? updatedLot.createdAt.toISOString() : new Date().toISOString(),
            updatedAt: updatedLot.updatedAt ? updatedLot.updatedAt.toISOString() : new Date().toISOString()
        };
    }
    validateTransition(from, to) {
        const allowedTransitions = {
            [Lot_1.LotStatus.RECEIVED]: [Lot_1.LotStatus.CHECKED, Lot_1.LotStatus.QUARANTINED],
            [Lot_1.LotStatus.CHECKED]: [Lot_1.LotStatus.SHELVED, Lot_1.LotStatus.QUARANTINED, Lot_1.LotStatus.DISCARDED],
            [Lot_1.LotStatus.SHELVED]: [Lot_1.LotStatus.QUARANTINED, Lot_1.LotStatus.DISCARDED, Lot_1.LotStatus.RESERVED],
            [Lot_1.LotStatus.RESERVED]: [Lot_1.LotStatus.RELEASED, Lot_1.LotStatus.SHELVED, Lot_1.LotStatus.QUARANTINED],
            [Lot_1.LotStatus.QUARANTINED]: [Lot_1.LotStatus.DISCARDED, Lot_1.LotStatus.CHECKED],
            [Lot_1.LotStatus.RELEASED]: [],
            [Lot_1.LotStatus.DISCARDED]: []
        };
        const validTargets = allowedTransitions[from] || [];
        return validTargets.includes(to);
    }
    determineEventType(from, to) {
        if (from === Lot_1.LotStatus.RECEIVED && to === Lot_1.LotStatus.CHECKED)
            return 'INSPECTION_PASSED';
        if (from === Lot_1.LotStatus.RECEIVED && to === Lot_1.LotStatus.QUARANTINED)
            return 'INSPECTION_FAILED';
        if (from === Lot_1.LotStatus.CHECKED && to === Lot_1.LotStatus.SHELVED)
            return 'SHELVED';
        if (from === Lot_1.LotStatus.CHECKED && to === Lot_1.LotStatus.QUARANTINED)
            return 'QUARANTINED';
        if (from === Lot_1.LotStatus.SHELVED && to === Lot_1.LotStatus.QUARANTINED)
            return 'QUARANTINED';
        if (to === Lot_1.LotStatus.DISCARDED)
            return 'DISCARDED';
        if (to === Lot_1.LotStatus.RESERVED)
            return 'RESERVED';
        if (to === Lot_1.LotStatus.RELEASED)
            return 'RELEASED';
        return `STATUS_CHANGE_TO_${to.toUpperCase()}`;
    }
}
exports.TransitionLotStatusUseCase = TransitionLotStatusUseCase;
