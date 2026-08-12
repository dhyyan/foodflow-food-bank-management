import { IRecipientRepository } from '../../domain/interface/repositoryInterface/IRecipientRepository';
import { IDistributionRepository } from '../../domain/interface/repositoryInterface/IDistributionRepository';
import { RecipientQuotaResponseDTO } from '../../domain/interface/DTOs/RecipientDTO';
import { BadRequestError } from '../../shared/errors/AppError';
import { Recipient } from '../../domain/entities/Recipient';

export class CheckRecipientQuotaUseCase {
  constructor(
    private readonly recipientRepository: IRecipientRepository,
    private readonly distributionRepository: IDistributionRepository
  ) {}

  async execute(identifier: string): Promise<RecipientQuotaResponseDTO> {
    if (!identifier || !identifier.trim()) {
      throw new BadRequestError('Recipient email or ID is required to check monthly quota');
    }

    const cleanInput = identifier.trim();
    let recipient: Recipient | null = null;

    // Try finding by ID first if valid ObjectId format
    if (cleanInput.match(/^[0-9a-fA-F]{24}$/)) {
      recipient = await this.recipientRepository.findById(cleanInput);
    }

    // If not found by ID, search by contact email
    if (!recipient) {
      recipient = await this.recipientRepository.findByEmail(cleanInput.toLowerCase());
    }

    if (!recipient) {
      return {
        exists: false,
        monthlyQuota: 50,
        usedThisMonth: 0,
        remainingQuota: 50,
        isQuotaCompleted: false
      };
    }

    const now = new Date();
    const currentYear = now.getUTCFullYear();
    const currentMonth = now.getUTCMonth() + 1; // 1-indexed

    const usedThisMonth = await this.distributionRepository.sumMonthlyUnitsByRecipientId(
      recipient.id!,
      currentYear,
      currentMonth
    );

    const monthlyQuota = recipient.monthlyQuota || (recipient.type === 'family' ? 50 : 0);
    
    let remainingQuota = recipient.type === 'family' ? Math.max(0, monthlyQuota - usedThisMonth) : 999999;
    const isQuotaCompleted = recipient.type === 'family' && usedThisMonth >= monthlyQuota;

    return {
      exists: true,
      recipient: {
        id: recipient.id!,
        name: recipient.name,
        type: recipient.type,
        monthlyQuota: recipient.monthlyQuota,
        contactPerson: recipient.contactPerson,
        contactEmail: recipient.contactEmail,
        address: recipient.address,
        createdAt: recipient.createdAt ? recipient.createdAt.toISOString() : new Date().toISOString(),
        updatedAt: recipient.updatedAt ? recipient.updatedAt.toISOString() : new Date().toISOString()
      },
      monthlyQuota,
      usedThisMonth,
      remainingQuota,
      isQuotaCompleted
    };
  }
}
