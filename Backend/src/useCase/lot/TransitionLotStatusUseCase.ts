import { ILotRepository } from '../../domain/interface/repositoryInterface/ILotRepository';
import { ILotEventRepository } from '../../domain/interface/repositoryInterface/ILotEventRepository';
import { LotResponseDTO, TransitionLotStatusDTO } from '../../domain/interface/DTOs/LotDTO';
import { LotStatus } from '../../domain/entities/Lot';
import { LotEvent } from '../../domain/entities/LotEvent';
import { BadRequestError, NotFoundError } from '../../shared/errors/AppError';
import { FieldAuditLogModel } from '../../frameWork/database/models/FieldAuditLogModel';

export interface ITransitionLotStatusUseCase {
  execute(
    lotId: string,
    dto: TransitionLotStatusDTO,
    userId: string,
    userName: string,
    userRole?: string
  ): Promise<LotResponseDTO>;
}

export class TransitionLotStatusUseCase implements ITransitionLotStatusUseCase {
  constructor(
    private readonly lotRepository: ILotRepository,
    private readonly lotEventRepository: ILotEventRepository
  ) {}

  async execute(
    lotId: string,
    dto: TransitionLotStatusDTO,
    userId: string,
    userName: string,
    userRole?: string
  ): Promise<LotResponseDTO> {
    const lot = await this.lotRepository.findById(lotId);
    if (!lot) {
      throw new NotFoundError(`Lot with identifier '${lotId}' was not found`);
    }

    const currentStatus = lot.status;
    const targetStatus = dto.targetStatus as LotStatus;

    if (currentStatus === targetStatus) {
      throw new BadRequestError(`Lot is already in '${currentStatus}' status`);
    }

    // Validate state machine transitions
    const isValidTransition = this.validateTransition(currentStatus, targetStatus);
    if (!isValidTransition) {
      throw new BadRequestError(
        `Invalid status transition from '${currentStatus}' to '${targetStatus}'. Please verify the inspection and shelving workflow rules.`
      );
    }

    // Update lot status
    const updatedLot = await this.lotRepository.updateStatus(lot.id!, targetStatus);
    if (!updatedLot) {
      throw new Error(`Failed to update status for Lot #${lot.lotNumber}`);
    }

    // Determine event type
    const eventType = this.determineEventType(currentStatus, targetStatus);

    // Save audit event
    const eventEntity = new LotEvent({
      lotId: lot.id!,
      eventType,
      previousStatus: currentStatus,
      newStatus: targetStatus,
      performedBy: {
        id: userId,
        name: userName,
        role: userRole
      },
      notes: dto.notes || `Status changed from ${currentStatus} to ${targetStatus}`,
      timestamp: new Date()
    });

    await this.lotEventRepository.create(eventEntity);

    // Save Field-Level Audit Log Diff (Who/When/Old/New)
    await FieldAuditLogModel.create({
      entityType: 'Lot',
      entityId: lot.id!,
      lotNumber: lot.lotNumber,
      fieldName: 'status',
      oldValue: currentStatus,
      newValue: targetStatus,
      changedBy: { id: userId, name: userName, role: userRole },
      notes: dto.notes || `Status state transition from ${currentStatus} to ${targetStatus}`,
      timestamp: new Date()
    });

    return {
      id: updatedLot.id!,
      lotNumber: updatedLot.lotNumber,
      itemName: updatedLot.itemName,
      category: updatedLot.category,
      quantity: updatedLot.quantity,
      availableQuantity: updatedLot.availableQuantity,
      unit: updatedLot.unit,
      receivedDate: updatedLot.receivedDate.toISOString(),
      printedExpiryDate: updatedLot.printedExpiryDate ? updatedLot.printedExpiryDate.toISOString() : undefined,
      safetyMarginDays: updatedLot.safetyMarginDays,
      effectiveExpiryDate: updatedLot.effectiveExpiryDate ? updatedLot.effectiveExpiryDate.toISOString() : undefined,
      donationId: updatedLot.donationId,
      donationLineId: updatedLot.donationLineId,
      donorName: (updatedLot as any).donorName || (lot as any).donorName,
      donorType: (updatedLot as any).donorType || (lot as any).donorType,
      status: updatedLot.status,
      createdBy: updatedLot.createdBy,
      createdAt: updatedLot.createdAt ? updatedLot.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: updatedLot.updatedAt ? updatedLot.updatedAt.toISOString() : new Date().toISOString()
    };
  }

  private validateTransition(from: LotStatus, to: LotStatus): boolean {
    const allowedTransitions: Record<string, string[]> = {
      [LotStatus.RECEIVED]: [LotStatus.CHECKED, LotStatus.QUARANTINED],
      [LotStatus.CHECKED]: [LotStatus.SHELVED, LotStatus.QUARANTINED, LotStatus.DISCARDED],
      [LotStatus.SHELVED]: [LotStatus.QUARANTINED, LotStatus.DISCARDED, LotStatus.RESERVED],
      [LotStatus.RESERVED]: [LotStatus.RELEASED, LotStatus.SHELVED, LotStatus.QUARANTINED],
      [LotStatus.QUARANTINED]: [LotStatus.DISCARDED, LotStatus.CHECKED],
      [LotStatus.RELEASED]: [],
      [LotStatus.DISCARDED]: []
    };

    const validTargets = allowedTransitions[from] || [];
    return validTargets.includes(to);
  }

  private determineEventType(from: LotStatus, to: LotStatus): string {
    if (from === LotStatus.RECEIVED && to === LotStatus.CHECKED) return 'INSPECTION_PASSED';
    if (from === LotStatus.RECEIVED && to === LotStatus.QUARANTINED) return 'INSPECTION_FAILED';
    if (from === LotStatus.CHECKED && to === LotStatus.SHELVED) return 'SHELVED';
    if (from === LotStatus.CHECKED && to === LotStatus.QUARANTINED) return 'QUARANTINED';
    if (from === LotStatus.SHELVED && to === LotStatus.QUARANTINED) return 'QUARANTINED';
    if (to === LotStatus.DISCARDED) return 'DISCARDED';
    if (to === LotStatus.RESERVED) return 'RESERVED';
    if (to === LotStatus.RELEASED) return 'RELEASED';
    return `STATUS_CHANGE_TO_${to.toUpperCase()}`;
  }
}
