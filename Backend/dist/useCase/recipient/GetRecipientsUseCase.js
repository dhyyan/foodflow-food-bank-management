"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetRecipientsUseCase = void 0;
class GetRecipientsUseCase {
    recipientRepository;
    constructor(recipientRepository) {
        this.recipientRepository = recipientRepository;
    }
    async execute(filter) {
        const recipients = await this.recipientRepository.findAll(filter);
        return recipients.map((saved) => ({
            id: saved.id,
            name: saved.name,
            type: saved.type,
            monthlyQuota: saved.monthlyQuota,
            contactPerson: saved.contactPerson,
            contactEmail: saved.contactEmail,
            address: saved.address,
            createdAt: saved.createdAt ? saved.createdAt.toISOString() : new Date().toISOString(),
            updatedAt: saved.updatedAt ? saved.updatedAt.toISOString() : new Date().toISOString()
        }));
    }
}
exports.GetRecipientsUseCase = GetRecipientsUseCase;
