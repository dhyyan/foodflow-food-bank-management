import { Recipient, RecipientType } from '../../entities/Recipient';

export interface IRecipientRepository {
  create(recipient: Recipient): Promise<Recipient>;
  findById(id: string): Promise<Recipient | null>;
  findAll(filter?: { type?: RecipientType; search?: string }): Promise<Recipient[]>;
  count(): Promise<number>;
}
