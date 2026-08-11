import { LotStatus } from './Lot';

export interface ILotEventPerformedBy {
  id: string;
  name: string;
  role?: string;
}

export interface ILotEvent {
  id?: string;
  lotId: string;
  eventType: string;
  previousStatus?: LotStatus | string;
  newStatus: LotStatus | string;
  performedBy: ILotEventPerformedBy;
  notes?: string;
  timestamp?: Date;
  createdAt?: Date;
}

export class LotEvent implements ILotEvent {
  public id?: string;
  public lotId: string;
  public eventType: string;
  public previousStatus?: LotStatus | string;
  public newStatus: LotStatus | string;
  public performedBy: ILotEventPerformedBy;
  public notes?: string;
  public timestamp: Date;
  public createdAt?: Date;

  constructor(props: ILotEvent) {
    this.id = props.id;
    this.lotId = props.lotId;
    this.eventType = props.eventType;
    this.previousStatus = props.previousStatus;
    this.newStatus = props.newStatus;
    this.performedBy = props.performedBy;
    this.notes = props.notes;
    this.timestamp = props.timestamp ? new Date(props.timestamp) : new Date();
    this.createdAt = props.createdAt ? new Date(props.createdAt) : this.timestamp;
  }
}
