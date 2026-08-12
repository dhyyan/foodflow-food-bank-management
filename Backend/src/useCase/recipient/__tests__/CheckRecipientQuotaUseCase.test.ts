import { CheckRecipientQuotaUseCase } from '../CheckRecipientQuotaUseCase';
import { IRecipientRepository } from '../../../domain/interface/repositoryInterface/IRecipientRepository';
import { IDistributionRepository } from '../../../domain/interface/repositoryInterface/IDistributionRepository';
import { Recipient } from '../../../domain/entities/Recipient';

describe('CheckRecipientQuotaUseCase', () => {
  let useCase: CheckRecipientQuotaUseCase;
  let mockRecipientRepository: jest.Mocked<IRecipientRepository>;
  let mockDistributionRepository: jest.Mocked<IDistributionRepository>;

  beforeEach(() => {
    mockRecipientRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      count: jest.fn()
    };

    mockDistributionRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      updateStatus: jest.fn(),
      count: jest.fn(),
      sumMonthlyUnitsByRecipientId: jest.fn()
    };

    useCase = new CheckRecipientQuotaUseCase(mockRecipientRepository, mockDistributionRepository);
  });

  test('should return exists: false when recipient email is not found', async () => {
    mockRecipientRepository.findByEmail.mockResolvedValue(null);

    const result = await useCase.execute('unknown@family.com');

    expect(result.exists).toBe(false);
    expect(result.monthlyQuota).toBe(50);
    expect(result.usedThisMonth).toBe(0);
    expect(result.remainingQuota).toBe(50);
    expect(result.isQuotaCompleted).toBe(false);
  });

  test('should return correct quota calculation for existing family recipient below quota', async () => {
    const familyRecipient = new Recipient({
      id: 'rec-101',
      name: 'Smith Family',
      type: 'family',
      monthlyQuota: 50,
      contactEmail: 'smith@family.com'
    });

    mockRecipientRepository.findByEmail.mockResolvedValue(familyRecipient);
    mockDistributionRepository.sumMonthlyUnitsByRecipientId.mockResolvedValue(30);

    const result = await useCase.execute('smith@family.com');

    expect(result.exists).toBe(true);
    expect(result.recipient?.name).toBe('Smith Family');
    expect(result.monthlyQuota).toBe(50);
    expect(result.usedThisMonth).toBe(30);
    expect(result.remainingQuota).toBe(20);
    expect(result.isQuotaCompleted).toBe(false);
  });

  test('should mark isQuotaCompleted as true when family has reached or exceeded 50 units', async () => {
    const familyRecipient = new Recipient({
      id: 'rec-102',
      name: 'Doe Family',
      type: 'family',
      monthlyQuota: 50,
      contactEmail: 'doe@family.com'
    });

    mockRecipientRepository.findByEmail.mockResolvedValue(familyRecipient);
    mockDistributionRepository.sumMonthlyUnitsByRecipientId.mockResolvedValue(50);

    const result = await useCase.execute('doe@family.com');

    expect(result.exists).toBe(true);
    expect(result.usedThisMonth).toBe(50);
    expect(result.remainingQuota).toBe(0);
    expect(result.isQuotaCompleted).toBe(true);
  });
});
