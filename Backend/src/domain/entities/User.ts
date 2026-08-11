export enum UserRole {
  ADMIN = 'admin',
  DONATION_CLERK = 'donation_clerk',
  STOCK_MANAGER = 'stock_manager',
  HANDOUT_COORDINATOR = 'handout_coordinator'
}

export interface IUser {
  id?: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User implements IUser {
  public id?: string;
  public name: string;
  public email: string;
  public passwordHash: string;
  public role: UserRole;
  public isActive: boolean;
  public createdBy?: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(props: IUser) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email.toLowerCase().trim();
    this.passwordHash = props.passwordHash;
    this.role = props.role;
    this.isActive = props.isActive ?? true;
    this.createdBy = props.createdBy;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
