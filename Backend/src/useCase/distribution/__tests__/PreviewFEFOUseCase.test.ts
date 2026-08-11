import { PreviewFEFOUseCase } from '../PreviewFEFOUseCase';
import { LotStatus } from '../../../domain/entities/Lot';
import { NotFoundError } from '../../../shared/errors/AppError';

describe('PreviewFEFOUseCase Unit Tests', () => {
  let useCase: PreviewFEFOUseCase;
  let mockDistributionRepository: any;
  let mockLotRepository: any;

  const sampleDistribution = {
    id: 'dist-123',
    distributionNumber: 'DIST-2026-001',
    recipientName: 'Community Shelter',
    recipientType: 'Shelter',
    items: [
      { itemName: 'Basmati Rice', requestedQuantity: 60, unit: 'kg' }
    ]
  };

  const sampleShelvedLots = [
    {
      id: 'lot-1',
      lotNumber: 'LOT-001',
      itemName: 'Basmati Rice',
      category: 'Grains',
      availableQuantity: 30,
      unit: 'kg',
      status: LotStatus.SHELVED,
      printedExpiryDate: new Date('2026-10-01'),
      safetyMarginDays: 3,
      effectiveExpiryDate: new Date('2026-09-28') // Later expiry
    },
    {
      id: 'lot-2',
      lotNumber: 'LOT-002',
      itemName: 'Basmati Rice',
      category: 'Grains',
      availableQuantity: 50,
      unit: 'kg',
      status: LotStatus.SHELVED,
      printedExpiryDate: new Date('2026-08-20'),
      safetyMarginDays: 3,
      effectiveExpiryDate: new Date('2026-08-17') // Earliest expiry (FEFO Priority)
    }
  ];

  beforeEach(() => {
    mockDistributionRepository = {
      findById: jest.fn()
    };
    mockLotRepository = {
      findAll: jest.fn()
    };

    useCase = new PreviewFEFOUseCase(mockDistributionRepository, mockLotRepository);
  });

  test('FEFO Allocation: Should prioritize earliest expiry date first', async () => {
    mockDistributionRepository.findById.mockResolvedValue(sampleDistribution);
    mockLotRepository.findAll.mockResolvedValue({ lots: sampleShelvedLots, total: 2 });

    const result = await useCase.execute('dist-123');

    expect(result.items.length).toBe(1);
    const itemAlloc = result.items[0];
    expect(itemAlloc.allocatedQuantity).toBe(60);
    expect(itemAlloc.isFulfilled).toBe(true);

    // Earliest expiry lot (LOT-002) allocated first
    expect(itemAlloc.allocations[0].lotNumber).toBe('LOT-002');
    expect(itemAlloc.allocations[0].allocatedQuantity).toBe(50);

    // Remaining 10 units taken from LOT-001
    expect(itemAlloc.allocations[1].lotNumber).toBe('LOT-001');
    expect(itemAlloc.allocations[1].allocatedQuantity).toBe(10);
  });

  test('Expired lot protection: Should exclude expired stock', async () => {
    const expiredLot = {
      id: 'lot-exp',
      lotNumber: 'LOT-EXP',
      itemName: 'Basmati Rice',
      availableQuantity: 100,
      unit: 'kg',
      status: LotStatus.SHELVED,
      effectiveExpiryDate: new Date('2020-01-01') // Expired!
    };

    mockDistributionRepository.findById.mockResolvedValue(sampleDistribution);
    mockLotRepository.findAll.mockResolvedValue({ lots: [expiredLot], total: 1 });

    const result = await useCase.execute('dist-123');

    expect(result.totalAllocatedUnits).toBe(0);
    expect(result.isFullyFulfilled).toBe(false);
  });

  test('Non-existent distribution should throw NotFoundError', async () => {
    mockDistributionRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('invalid-id')).rejects.toThrow(NotFoundError);
  });
});
