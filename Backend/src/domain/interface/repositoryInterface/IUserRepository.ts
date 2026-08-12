import { User } from '../../entities/User';
import { UserFilterDTO } from '../DTOs/UserDTO';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(user: User): Promise<User>;
  findAll(filter?: UserFilterDTO): Promise<{ users: User[]; total: number }>;
  updateStatus(id: string, isActive: boolean): Promise<User | null>;
}

