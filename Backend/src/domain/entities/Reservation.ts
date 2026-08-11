export type ReservationStatus = 'reserved' | 'released' | 'cancelled';

export interface IReservationCreatedBy {
  id: string;
  name: string;
}

export interface IReservation {
  id?: string;
  distributionId: string;
  lotId: string;
  lotNumber: string;
  itemName: string;
  quantity: number;
  unit: string;
  status: ReservationStatus;
  createdBy: IReservationCreatedBy;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Reservation implements IReservation {
  public id?: string;
  public distributionId: string;
  public lotId: string;
  public lotNumber: string;
  public itemName: string;
  public quantity: number;
  public unit: string;
  public status: ReservationStatus;
  public createdBy: IReservationCreatedBy;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(props: IReservation) {
    this.id = props.id;
    this.distributionId = props.distributionId;
    this.lotId = props.lotId;
    this.lotNumber = props.lotNumber;
    this.itemName = props.itemName;
    this.quantity = props.quantity;
    this.unit = props.unit;
    this.status = props.status;
    this.createdBy = props.createdBy;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
