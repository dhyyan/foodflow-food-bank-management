"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDonationByIdUseCase = void 0;
const AppError_1 = require("../../shared/errors/AppError");
class GetDonationByIdUseCase {
    donationRepository;
    lotRepository;
    constructor(donationRepository, lotRepository) {
        this.donationRepository = donationRepository;
        this.lotRepository = lotRepository;
    }
    async execute(id) {
        const donation = await this.donationRepository.findById(id);
        if (!donation || !donation.id) {
            throw new AppError_1.NotFoundError(`Donation with ID '${id}' was not found`);
        }
        const lots = await this.lotRepository.findByDonationId(donation.id);
        const donationDTO = {
            id: donation.id,
            donationNumber: donation.donationNumber,
            donorName: donation.donorName,
            donorType: donation.donorType,
            receivedAt: donation.receivedAt.toISOString(),
            receivedBy: donation.receivedBy,
            lines: donation.lines.map((l) => ({
                id: l.id,
                itemName: l.itemName,
                category: l.category || 'General',
                quantity: l.quantity,
                unit: l.unit,
                printedExpiryDate: l.printedExpiryDate ? l.printedExpiryDate.toISOString() : undefined,
                notes: l.notes
            })),
            totalLines: donation.lines.length,
            totalQuantity: donation.lines.reduce((sum, l) => sum + l.quantity, 0),
            notes: donation.notes,
            status: donation.status,
            createdAt: donation.createdAt ? donation.createdAt.toISOString() : new Date().toISOString(),
            updatedAt: donation.updatedAt ? donation.updatedAt.toISOString() : new Date().toISOString()
        };
        const lotDTOs = lots.map((lot) => ({
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
            status: lot.status,
            createdBy: lot.createdBy,
            createdAt: lot.createdAt ? lot.createdAt.toISOString() : new Date().toISOString(),
            updatedAt: lot.updatedAt ? lot.updatedAt.toISOString() : new Date().toISOString()
        }));
        return {
            donation: donationDTO,
            lots: lotDTOs
        };
    }
}
exports.GetDonationByIdUseCase = GetDonationByIdUseCase;
