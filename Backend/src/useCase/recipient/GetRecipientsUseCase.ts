import { IRecipientRepository } from '../../domain/interface/repositoryInterface/IRecipientRepository';
import { RecipientType } from '../../domain/entities/Recipient';
import { RecipientResponseDTO } from '../../domain/interface/DTOs/RecipientDTO';

export class GetRecipientsUseCase {
  constructor(private readonly recipientRepository: IRecipientRepository) {}

  async execute(filter?: { type?: RecipientType; search?: string }): Promise<RecipientResponseDTO[]> {
    const recipients = await this.recipientRepository.findAll(filter);

    return recipients.map((saved) => ({
      id: saved.id!,
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
