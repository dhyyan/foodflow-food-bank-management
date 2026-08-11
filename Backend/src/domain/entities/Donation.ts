export interface IDonationLine {
  id?: string;
  itemName: string;
  category?: string;
  quantity: number;
  unit: string;
  printedExpiryDate?: Date;
  notes?: string;
}

export interface IReceivedBy {
  id: string;
  name: string;
}

export interface IDonation {
  id?: string;
  donationNumber: string;
  donorName: string;
  donorType: string;
  receivedAt: Date;
  receivedBy: IReceivedBy;
  lines: IDonationLine[];
  notes?: string;
  status: 'received' | 'processed' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}

export class Donation implements IDonation {
  public id?: string;
  public donationNumber: string;
  public donorName: string;
  public donorType: string;
  public receivedAt: Date;
  public receivedBy: IReceivedBy;
  public lines: IDonationLine[];
  public notes?: string;
  public status: 'received' | 'processed' | 'cancelled';
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(props: IDonation) {
    this.id = props.id;
    this.donationNumber = props.donationNumber;
    this.donorName = props.donorName.trim();
    this.donorType = props.donorType.trim();
    this.receivedAt = props.receivedAt ? new Date(props.receivedAt) : new Date();
    this.receivedBy = props.receivedBy;
    this.lines = props.lines;
    this.notes = props.notes?.trim();
    this.status = props.status || 'received';
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
