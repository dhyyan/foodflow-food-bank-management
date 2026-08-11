export type RecipientType = 'family' | 'agency';

export interface IRecipient {
  id?: string;
  name: string;
  type: RecipientType;
  monthlyQuota: number;
  contactPerson?: string;
  contactEmail?: string;
  address?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Recipient implements IRecipient {
  public id?: string;
  public name: string;
  public type: RecipientType;
  public monthlyQuota: number;
  public contactPerson?: string;
  public contactEmail?: string;
  public address?: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(props: IRecipient) {
    this.id = props.id;
    this.name = props.name.trim();
    this.type = props.type;
    this.monthlyQuota = props.monthlyQuota ?? (props.type === 'family' ? 50 : 0);
    this.contactPerson = props.contactPerson ? props.contactPerson.trim() : undefined;
    this.contactEmail = props.contactEmail ? props.contactEmail.trim().toLowerCase() : undefined;
    this.address = props.address ? props.address.trim() : undefined;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
