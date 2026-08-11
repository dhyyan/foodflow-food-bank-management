"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetLotTraceUseCase = void 0;
const AppError_1 = require("../../shared/errors/AppError");
class GetLotTraceUseCase {
    lotRepository;
    lotEventRepository;
    donationRepository;
    reservationRepository;
    distributionRepository;
    constructor(lotRepository, lotEventRepository, donationRepository, reservationRepository, distributionRepository) {
        this.lotRepository = lotRepository;
        this.lotEventRepository = lotEventRepository;
        this.donationRepository = donationRepository;
        this.reservationRepository = reservationRepository;
        this.distributionRepository = distributionRepository;
    }
    async execute(lotId) {
        const lot = await this.lotRepository.findById(lotId);
        if (!lot) {
            throw new AppError_1.NotFoundError(`Lot with identifier '${lotId}' was not found`);
        }
        const [events, donation, reservations] = await Promise.all([
            this.lotEventRepository.findByLotId(lot.id),
            lot.donationId ? this.donationRepository.findById(lot.donationId) : Promise.resolve(null),
            this.reservationRepository.findByLotId(lot.id)
        ]);
        const lotDTO = {
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
            donorName: donation ? donation.donorName : lot.donorName,
            donorType: donation ? donation.donorType : lot.donorType,
            status: lot.status,
            createdBy: lot.createdBy,
            createdAt: lot.createdAt ? lot.createdAt.toISOString() : new Date().toISOString(),
            updatedAt: lot.updatedAt ? lot.updatedAt.toISOString() : new Date().toISOString()
        };
        const timelineDTOs = events.map((evt) => ({
            id: evt.id,
            lotId: evt.lotId,
            eventType: evt.eventType,
            previousStatus: evt.previousStatus,
            newStatus: evt.newStatus,
            performedBy: evt.performedBy,
            notes: evt.notes,
            timestamp: evt.timestamp.toISOString()
        }));
        // If timeline is empty (e.g. legacy lots), build a synthetic initial trace event
        if (timelineDTOs.length === 0) {
            if (donation) {
                timelineDTOs.push({
                    id: `initial-donation-${donation.id}`,
                    lotId: lot.id,
                    eventType: 'DONATION_INTAKE_RECORDED',
                    newStatus: 'received',
                    performedBy: {
                        id: donation.receivedBy.id,
                        name: donation.receivedBy.name,
                        role: 'Donation Clerk'
                    },
                    notes: `Donation intake recorded (${donation.donationNumber}) by ${donation.donorName}`,
                    timestamp: donation.receivedAt.toISOString()
                });
            }
            timelineDTOs.push({
                id: `initial-lot-${lot.id}`,
                lotId: lot.id,
                eventType: 'LOT_CREATED',
                previousStatus: undefined,
                newStatus: lot.status,
                performedBy: lot.createdBy,
                notes: `Lot #${lot.lotNumber} created for item '${lot.itemName}'`,
                timestamp: lot.receivedDate ? lot.receivedDate.toISOString() : (lot.createdAt ? lot.createdAt.toISOString() : new Date().toISOString())
            });
        }
        const result = {
            lot: lotDTO,
            donation: donation
                ? {
                    id: donation.id,
                    donationNumber: donation.donationNumber,
                    donorName: donation.donorName,
                    donorType: donation.donorType,
                    receivedAt: donation.receivedAt.toISOString(),
                    status: donation.status
                }
                : undefined,
            timeline: timelineDTOs,
            distributions: []
        };
        // Fetch associated distributions
        if (reservations.length > 0) {
            const distributionIds = Array.from(new Set(reservations.map(r => r.distributionId)));
            const distributions = await Promise.all(distributionIds.map(id => this.distributionRepository.findById(id)));
            const distributionDTOs = [];
            for (const res of reservations) {
                const dist = distributions.find(d => d && d.id === res.distributionId);
                if (dist) {
                    distributionDTOs.push({
                        distributionId: dist.id,
                        distributionNumber: dist.distributionNumber,
                        recipientName: dist.recipientName,
                        quantity: res.quantity,
                        status: dist.status,
                        reservedAt: dist.reservedAt ? dist.reservedAt.toISOString() : undefined,
                        completedAt: dist.completedAt ? dist.completedAt.toISOString() : undefined
                    });
                }
            }
            result.distributions = distributionDTOs.sort((a, b) => (b.reservedAt || '').localeCompare(a.reservedAt || ''));
        }
        return result;
    }
}
exports.GetLotTraceUseCase = GetLotTraceUseCase;
