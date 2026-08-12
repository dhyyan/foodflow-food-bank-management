import { IRecipientRepository } from '../../domain/interface/repositoryInterface/IRecipientRepository';
import { Recipient } from '../../domain/entities/Recipient';
import { CreateRecipientDTO, RecipientResponseDTO } from '../../domain/interface/DTOs/RecipientDTO';
import { BadRequestError, ConflictError } from '../../shared/errors/AppError';

export class CreateRecipientUseCase {
  constructor(private readonly recipientRepository: IRecipientRepository) {}

  async execute(dto: CreateRecipientDTO): Promise<RecipientResponseDTO> {
    if (!dto.name || !dto.name.trim()) {
      throw new BadRequestError('Recipient name is required');
    }
    if (!dto.type || (dto.type !== 'family' && dto.type !== 'agency')) {
      throw new BadRequestError('Recipient type must be either family or agency');
    }

    if (dto.contactEmail && dto.contactEmail.trim()) {
      const existing = await this.recipientRepository.findByEmail(dto.contactEmail.trim());
      if (existing) {
        throw new ConflictError(`A recipient family/agency with contact email '${dto.contactEmail.trim()}' already exists.`);
      }
    }

    const recipient = new Recipient({
      name: dto.name,
      type: dto.type,
      monthlyQuota: dto.monthlyQuota ?? (dto.type === 'family' ? 50 : 0),
      contactPerson: dto.contactPerson,
      contactEmail: dto.contactEmail,
      address: dto.address
    });

    const saved = await this.recipientRepository.create(recipient);

    return {
      id: saved.id!,
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
