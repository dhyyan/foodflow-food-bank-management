"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const User_1 = require("../../../domain/entities/User");
const UserModel_1 = require("../../../frameWork/database/models/UserModel");
const mongoose_1 = __importDefault(require("mongoose"));
class UserRepository {
    mapDocumentToEntity(doc) {
        return new User_1.User({
            id: doc._id.toString(),
            name: doc.name,
            email: doc.email,
            passwordHash: doc.passwordHash,
            role: doc.role,
            isActive: doc.isActive,
            createdBy: doc.createdBy?.toString(),
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        });
    }
    async findByEmail(email) {
        const doc = await UserModel_1.UserModel.findOne({ email: email.toLowerCase().trim() });
        if (!doc)
            return null;
        return this.mapDocumentToEntity(doc);
    }
    async findById(id) {
        if (!mongoose_1.default.Types.ObjectId.isValid(id))
            return null;
        const doc = await UserModel_1.UserModel.findById(id);
        if (!doc)
            return null;
        return this.mapDocumentToEntity(doc);
    }
    async create(user) {
        const createdDoc = await UserModel_1.UserModel.create({
            name: user.name,
            email: user.email,
            passwordHash: user.passwordHash,
            role: user.role,
            isActive: user.isActive,
            createdBy: user.createdBy ? new mongoose_1.default.Types.ObjectId(user.createdBy) : undefined
        });
        return this.mapDocumentToEntity(createdDoc);
    }
    async findAll() {
        const docs = await UserModel_1.UserModel.find().sort({ createdAt: -1 });
        return docs.map((doc) => this.mapDocumentToEntity(doc));
    }
}
exports.UserRepository = UserRepository;
