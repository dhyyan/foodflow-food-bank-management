"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipientRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Recipient_1 = require("../../../domain/entities/Recipient");
const RecipientModel_1 = require("../../../frameWork/database/models/RecipientModel");
class RecipientRepository {
    mapDocumentToEntity(doc) {
        return new Recipient_1.Recipient({
            id: doc._id.toString(),
            name: doc.name,
            type: doc.type,
            monthlyQuota: doc.monthlyQuota,
            contactPerson: doc.contactPerson,
            contactEmail: doc.contactEmail,
            address: doc.address,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        });
    }
    async create(recipient) {
        const createdDoc = await RecipientModel_1.RecipientModel.create({
            name: recipient.name,
            type: recipient.type,
            monthlyQuota: recipient.monthlyQuota,
            contactPerson: recipient.contactPerson,
            contactEmail: recipient.contactEmail,
            address: recipient.address
        });
        return this.mapDocumentToEntity(createdDoc);
    }
    async findById(id) {
        if (!mongoose_1.default.Types.ObjectId.isValid(id))
            return null;
        const doc = await RecipientModel_1.RecipientModel.findById(id);
        if (!doc)
            return null;
        return this.mapDocumentToEntity(doc);
    }
    async findAll(filter) {
        const query = {};
        if (filter?.type) {
            query.type = filter.type;
        }
        if (filter?.search) {
            const regex = new RegExp(filter.search, 'i');
            query.$or = [{ name: regex }, { contactPerson: regex }];
        }
        const docs = await RecipientModel_1.RecipientModel.find(query).sort({ name: 1 });
        return docs.map((d) => this.mapDocumentToEntity(d));
    }
    async count() {
        return await RecipientModel_1.RecipientModel.countDocuments();
    }
}
exports.RecipientRepository = RecipientRepository;
