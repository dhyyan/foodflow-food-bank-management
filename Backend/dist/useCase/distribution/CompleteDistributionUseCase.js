"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompleteDistributionUseCase = void 0;
const Lot_1 = require("../../domain/entities/Lot");
const LotEvent_1 = require("../../domain/entities/LotEvent");
const AppError_1 = require("../../shared/errors/AppError");
class CompleteDistributionUseCase {
    distributionRepository;
    lotRepository;
    reservationRepository;
    lotEventRepository;
    constructor(distributionRepository, lotRepository, reservationRepository, lotEventRepository) {
        this.distributionRepository = distributionRepository;
        this.lotRepository = lotRepository;
        this.reservationRepository = reservationRepository;
        this.lotEventRepository = lotEventRepository;
    }
    async execute(distributionId, coordinator) {
        const distribution = await this.distributionRepository.findById(distributionId);
        if (!distribution) {
            throw new AppError_1.NotFoundError('Distribution with provided ID was not found');
        }
        if (distribution.status !== 'reserved') {
            throw new AppError_1.BadRequestError(`Distribution cannot be completed because its current status is '${distribution.status}'. Only 'reserved' distributions can be completed.`);
        }
        // Retrieve active reservations for this distribution
        const reservations = await this.reservationRepository.findByDistributionId(distribution.id);
        const lotEvents = [];
        for (const res of reservations) {
            if (res.status === 'reserved') {
                const lot = await this.lotRepository.findById(res.lotId);
                if (lot) {
                    const newQuantity = Math.max(0, lot.quantity - res.quantity);
                    lot.quantity = newQuantity;
                    // If available quantity is 0 and total quantity reaches 0, transition status to RELEASED
                    if (lot.availableQuantity === 0 && lot.quantity === 0) {
                        lot.status = Lot_1.LotStatus.RELEASED;
                    }
                    await this.lotRepository.update(lot);
                    lotEvents.push(new LotEvent_1.LotEvent({
                        lotId: lot.id,
                        eventType: 'RELEASED',
                        previousStatus: Lot_1.LotStatus.RESERVED,
                        newStatus: lot.status,
                        performedBy: {
                            id: coordinator.id,
                            name: coordinator.name
                        },
                        notes: `Released ${res.quantity} units for completed Distribution #${distribution.distributionNumber}`
                    }));
                }
            }
        }
        // Update reservation statuses
        await this.reservationRepository.updateStatusByDistributionId(distribution.id, 'released');
        // Create lot events
        if (lotEvents.length > 0) {
            await this.lotEventRepository.createMany(lotEvents);
        }
        // Update distribution status to completed
        const updated = await this.distributionRepository.updateStatus(distribution.id, 'completed', {
            completedAt: new Date()
        });
        const updatedReservations = await this.reservationRepository.findByDistributionId(distribution.id);
        return {
            id: updated.id,
            distributionNumber: updated.distributionNumber,
            recipientId: updated.recipientId,
            recipientName: updated.recipientName,
            recipientType: updated.recipientType,
            items: updated.items,
            status: updated.status,
            reservations: updatedReservations.map((r) => ({
                id: r.id,
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
            createdBy: updated.createdBy,
            notes: updated.notes,
            reservedAt: updated.reservedAt ? updated.reservedAt.toISOString() : undefined,
            completedAt: updated.completedAt ? updated.completedAt.toISOString() : undefined,
            createdAt: updated.createdAt ? updated.createdAt.toISOString() : new Date().toISOString(),
            updatedAt: updated.updatedAt ? updated.updatedAt.toISOString() : new Date().toISOString()
        };
    }
}
exports.CompleteDistributionUseCase = CompleteDistributionUseCase;
