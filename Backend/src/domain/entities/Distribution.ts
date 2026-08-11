export type DistributionStatus = 'pending' | 'reserved' | 'completed' | 'cancelled';

export interface IDistributionItem {
  itemName: string;
  requestedQuantity: number;
  unit: string;
}

export interface IDistributionCreatedBy {
  id: string;
  name: string;
}

export interface IDistribution {
  id?: string;
  distributionNumber: string;
  recipientId: string;
  recipientName: string;
  recipientType: 'agency' | 'family';
  items: IDistributionItem[];
  status: DistributionStatus;
  notes?: string;
  createdBy: IDistributionCreatedBy;
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
  public recipientType: 'agency' | 'family';
  public items: IDistributionItem[];
  public status: DistributionStatus;
  public notes?: string;
  public createdBy: IDistributionCreatedBy;
  public reservedAt?: Date;
  public completedAt?: Date;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(props: IDistribution) {
    this.id = props.id;
    this.distributionNumber = props.distributionNumber;
    this.recipientId = props.recipientId;
    this.recipientName = props.recipientName;
    this.recipientType = props.recipientType;
    this.items = props.items;
    this.status = props.status;
    this.notes = props.notes;
    this.createdBy = props.createdBy;
    this.reservedAt = props.reservedAt;
    this.completedAt = props.completedAt;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
