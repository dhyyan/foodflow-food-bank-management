import { IUserRepository } from '../../../domain/interface/repositoryInterface/IUserRepository';
import { User, UserRole } from '../../../domain/entities/User';
import { UserModel, IUserDocument } from '../../../frameWork/database/models/UserModel';
import mongoose from 'mongoose';

export class UserRepository implements IUserRepository {
  private mapDocumentToEntity(doc: IUserDocument): User {
    return new User({
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      passwordHash: doc.passwordHash,
      role: doc.role as UserRole,
      isActive: doc.isActive,
      createdBy: doc.createdBy?.toString(),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email: email.toLowerCase().trim() });
    if (!doc) return null;
    return this.mapDocumentToEntity(doc);
  }

  async findById(id: string): Promise<User | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    const doc = await UserModel.findById(id);
    if (!doc) return null;
    return this.mapDocumentToEntity(doc);
  }

  async create(user: User): Promise<User> {
    const createdDoc = await UserModel.create({
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      role: user.role,
      isActive: user.isActive,
      createdBy: user.createdBy ? new mongoose.Types.ObjectId(user.createdBy) : undefined
    });
    return this.mapDocumentToEntity(createdDoc);
  }

  async findAll(): Promise<User[]> {
    const docs = await UserModel.find().sort({ createdAt: -1 });
    return docs.map((doc) => this.mapDocumentToEntity(doc));
  }
}
