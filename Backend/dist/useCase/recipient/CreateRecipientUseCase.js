"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRecipientUseCase = void 0;
const Recipient_1 = require("../../domain/entities/Recipient");
const AppError_1 = require("../../shared/errors/AppError");
class CreateRecipientUseCase {
    recipientRepository;
    constructor(recipientRepository) {
        this.recipientRepository = recipientRepository;
    }
    async execute(dto) {
        if (!dto.name || !dto.name.trim()) {
            throw new AppError_1.BadRequestError('Recipient name is required');
        }
        if (!dto.type || (dto.type !== 'family' && dto.type !== 'agency')) {
            throw new AppError_1.BadRequestError('Recipient type must be either family or agency');
        }
        const recipient = new Recipient_1.Recipient({
            name: dto.name,
            type: dto.type,
            monthlyQuota: dto.monthlyQuota ?? (dto.type === 'family' ? 50 : 0),
            contactPerson: dto.contactPerson,
            contactEmail: dto.contactEmail,
            address: dto.address
        });
        const saved = await this.recipientRepository.create(recipient);
        return {
            id: saved.id,
            name: saved.name,
            type: saved.type,
            monthlyQuota: saved.monthlyQuota,
            contactPerson: saved.contactPerson,
            contactEmail: saved.contactEmail,
            address: saved.address,
            createdAt: saved.createdAt ? saved.createdAt.toISOString() : new Date().toISOString(),
            updatedAt: saved.updatedAt ? saved.updatedAt.toISOString() : new Date().toISOString()
        };
    }
}
exports.CreateRecipientUseCase = CreateRecipientUseCase;
