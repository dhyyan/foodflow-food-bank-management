import { RecipientType } from '../../entities/Recipient';

export interface CreateRecipientDTO {
  name: string;
  type: RecipientType;
  monthlyQuota?: number;
  contactPerson?: string;
  contactEmail?: string;
  address?: string;
}

export interface RecipientResponseDTO {
  id: string;
  name: string;
  type: RecipientType;
  monthlyQuota: number;
  contactPerson?: string;
  contactEmail?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}
