import { UserRole } from '../../entities/User';

export interface RegisterUserDTO {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  adminId?: string;
}

export interface UserResponseDTO {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginResponseDTO {
  user: UserResponseDTO;
  token: string;
}

export interface UserFilterDTO {
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
}

export interface UserPaginatedResponseDTO {
  users: UserResponseDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

