export enum LotStatus {
  RECEIVED = 'received',
  CHECKED = 'checked',
  SHELVED = 'shelved',
  RESERVED = 'reserved',
  RELEASED = 'released',
  QUARANTINED = 'quarantined',
  DISCARDED = 'discarded'
}

export interface ILotCreatedBy {
  id: string;
  name: string;
}

export interface ILot {
  id?: string;
  lotNumber: string;
  itemName: string;
  category: string;
  quantity: number;
  availableQuantity: number;
  unit: string;
  receivedDate: Date;
  printedExpiryDate?: Date;
  safetyMarginDays: number;
  effectiveExpiryDate?: Date;
  donationId: string;
  donationLineId?: string;
  status: LotStatus;
  createdBy: ILotCreatedBy;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Lot implements ILot {
  public id?: string;
  public lotNumber: string;
  public itemName: string;
  public category: string;
  public quantity: number;
  public availableQuantity: number;
  public unit: string;
  public receivedDate: Date;
  public printedExpiryDate?: Date;
  public safetyMarginDays: number;
  public effectiveExpiryDate?: Date;
  public donationId: string;
  public donationLineId?: string;
  public status: LotStatus;
  public createdBy: ILotCreatedBy;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(props: ILot) {
    this.id = props.id;
    this.lotNumber = props.lotNumber;
    this.itemName = props.itemName.trim();
    this.category = props.category ? props.category.trim() : 'General';
    this.quantity = props.quantity;
    this.availableQuantity = props.availableQuantity ?? props.quantity;
    this.unit = props.unit.trim();
    this.receivedDate = props.receivedDate ? new Date(props.receivedDate) : new Date();
    this.printedExpiryDate = props.printedExpiryDate ? new Date(props.printedExpiryDate) : undefined;
    this.safetyMarginDays = props.safetyMarginDays ?? 3;
    this.effectiveExpiryDate = props.effectiveExpiryDate
      ? new Date(props.effectiveExpiryDate)
      : Lot.calculateEffectiveExpiryDate(this.printedExpiryDate, this.safetyMarginDays);
    this.donationId = props.donationId;
    this.donationLineId = props.donationLineId;
    this.status = props.status || LotStatus.RECEIVED;
    this.createdBy = props.createdBy;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  public static calculateEffectiveExpiryDate(printedDate?: Date, safetyMarginDays: number = 3): Date | undefined {
    if (!printedDate) return undefined;
    const effective = new Date(printedDate.getTime());
    effective.setDate(effective.getDate() - safetyMarginDays);
    return effective;
  }
}
