import { RecipientType } from './Recipient';
import { Reservation } from './Reservation';

export type DistributionStatus = 'pending' | 'reserved' | 'completed' | 'cancelled';

export interface IDistributionItem {
  itemName: string;
  requestedQuantity: number;
  unit: string;
}

export interface IDistributionUser {
  id: string;
  name: string;
}

export interface IDistribution {
  id?: string;
  distributionNumber: string;
  recipientId: string;
  recipientName: string;
  recipientType: RecipientType;
  items: IDistributionItem[];
  status: DistributionStatus;
  reservations?: Reservation[];
  createdBy: IDistributionUser;
  notes?: string;
  reservedAt?: Date;
  completedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Distribution implements IDistribution {
  public id?: string;
  public distributionNumber: string;
  public recipientId: string;
  public recipientName: string;
  public recipientType: RecipientType;
  public items: IDistributionItem[];
  public status: DistributionStatus;
  public reservations?: Reservation[];
  public createdBy: IDistributionUser;
  public notes?: string;
  public reservedAt?: Date;
  public completedAt?: Date;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(props: IDistribution) {
    this.id = props.id;
    this.distributionNumber = props.distributionNumber;
    this.recipientId = props.recipientId;
    this.recipientName = props.recipientName.trim();
    this.recipientType = props.recipientType;
    this.items = props.items.map((item) => ({
      itemName: item.itemName.trim(),
      requestedQuantity: item.requestedQuantity,
      unit: item.unit ? item.unit.trim() : 'units'
    }));
    this.status = props.status || 'pending';
    this.reservations = props.reservations;
    this.createdBy = props.createdBy;
    this.notes = props.notes ? props.notes.trim() : undefined;
    this.reservedAt = props.reservedAt ? new Date(props.reservedAt) : undefined;
    this.completedAt = props.completedAt ? new Date(props.completedAt) : undefined;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
