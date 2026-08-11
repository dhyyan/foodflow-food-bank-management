import { TransitionLotStatusUseCase } from '../TransitionLotStatusUseCase';
import { LotStatus } from '../../../domain/entities/Lot';
import { BadRequestError, NotFoundError } from '../../../shared/errors/AppError';

describe('Lot State Machine Unit Tests', () => {
  let useCase: TransitionLotStatusUseCase;
  let mockLotRepository: any;
  let mockLotEventRepository: any;

  const sampleLot = {
    id: 'lot-123',
    lotNumber: 'LOT-2026-001',
    itemName: 'Fresh Milk',
    category: 'Dairy',
    quantity: 50,
    availableQuantity: 50,
    unit: 'units',
    receivedDate: new Date(),
    safetyMarginDays: 3,
    status: LotStatus.RECEIVED,
    createdBy: { id: 'user-1', name: 'Clerk User' }
  };

  beforeEach(() => {
    mockLotRepository = {
      findById: jest.fn(),
      updateStatus: jest.fn()
    };
    mockLotEventRepository = {
      create: jest.fn().mockResolvedValue(true)
    };

    useCase = new TransitionLotStatusUseCase(mockLotRepository, mockLotEventRepository);
  });

  test('Valid Transition: RECEIVED -> CHECKED should succeed', async () => {
    mockLotRepository.findById.mockResolvedValue({ ...sampleLot, status: LotStatus.RECEIVED });
    mockLotRepository.updateStatus.mockResolvedValue({ ...sampleLot, status: LotStatus.CHECKED });

    const result = await useCase.execute('lot-123', { targetStatus: LotStatus.CHECKED }, 'u-1', 'Test User');

    expect(result.status).toBe(LotStatus.CHECKED);
    expect(mockLotEventRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        previousStatus: LotStatus.RECEIVED,
        newStatus: LotStatus.CHECKED
      })
    );
  });

  test('Valid Transition: CHECKED -> SHELVED should succeed', async () => {
    mockLotRepository.findById.mockResolvedValue({ ...sampleLot, status: LotStatus.CHECKED });
    mockLotRepository.updateStatus.mockResolvedValue({ ...sampleLot, status: LotStatus.SHELVED });

    const result = await useCase.execute('lot-123', { targetStatus: LotStatus.SHELVED }, 'u-1', 'Test User');

    expect(result.status).toBe(LotStatus.SHELVED);
  });

  test('Invalid Transition: Skip state (RECEIVED -> RELEASED) should throw BadRequestError', async () => {
    mockLotRepository.findById.mockResolvedValue({ ...sampleLot, status: LotStatus.RECEIVED });

    await expect(
      useCase.execute('lot-123', { targetStatus: LotStatus.RELEASED }, 'u-1', 'Test User')
    ).rejects.toThrow(BadRequestError);
  });

  test('Invalid Transition: Backward transition (RELEASED -> RECEIVED) should throw BadRequestError', async () => {
    mockLotRepository.findById.mockResolvedValue({ ...sampleLot, status: LotStatus.RELEASED });

    await expect(
      useCase.execute('lot-123', { targetStatus: LotStatus.RECEIVED }, 'u-1', 'Test User')
    ).rejects.toThrow(BadRequestError);
  });

  test('Same status transition (RECEIVED -> RECEIVED) should throw BadRequestError', async () => {
    mockLotRepository.findById.mockResolvedValue({ ...sampleLot, status: LotStatus.RECEIVED });

    await expect(
      useCase.execute('lot-123', { targetStatus: LotStatus.RECEIVED }, 'u-1', 'Test User')
    ).rejects.toThrow(BadRequestError);
  });

  test('Non-existent lot should throw NotFoundError', async () => {
    mockLotRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute('invalid-id', { targetStatus: LotStatus.CHECKED }, 'u-1', 'Test User')
    ).rejects.toThrow(NotFoundError);
  });
});
