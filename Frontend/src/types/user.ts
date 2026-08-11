import type { UserRoleType } from '../constants/roles';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRoleType;
  isActive: boolean;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterUserDto {
  name: string;
  email: string;
  password: string;
  role: UserRoleType;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponseData {
  user: User;
  token: string;
}
