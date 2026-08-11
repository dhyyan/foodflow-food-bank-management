"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDonationsUseCase = void 0;
class GetDonationsUseCase {
    donationRepository;
    constructor(donationRepository) {
        this.donationRepository = donationRepository;
    }
    async execute(filter) {
        const page = filter?.page || 1;
        const limit = filter?.limit || 20;
        const { donations, total } = await this.donationRepository.findAll(filter);
        const donationDTOs = donations.map((d) => ({
            id: d.id,
            donationNumber: d.donationNumber,
            donorName: d.donorName,
            donorType: d.donorType,
            receivedAt: d.receivedAt.toISOString(),
            receivedBy: d.receivedBy,
            lines: d.lines.map((l) => ({
                id: l.id,
                itemName: l.itemName,
                category: l.category || 'General',
                quantity: l.quantity,
                unit: l.unit,
                printedExpiryDate: l.printedExpiryDate ? l.printedExpiryDate.toISOString() : undefined,
                notes: l.notes
            })),
            totalLines: d.lines.length,
            totalQuantity: d.lines.reduce((sum, l) => sum + l.quantity, 0),
            notes: d.notes,
            status: d.status,
            createdAt: d.createdAt ? d.createdAt.toISOString() : new Date().toISOString(),
            updatedAt: d.updatedAt ? d.updatedAt.toISOString() : new Date().toISOString()
        }));
        return {
            donations: donationDTOs,
            total,
            page,
            limit
        };
    }
}
exports.GetDonationsUseCase = GetDonationsUseCase;
