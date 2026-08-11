"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DistributionRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Distribution_1 = require("../../../domain/entities/Distribution");
const DistributionModel_1 = require("../../../frameWork/database/models/DistributionModel");
class DistributionRepository {
    mapDocumentToEntity(doc) {
        return new Distribution_1.Distribution({
            id: doc._id.toString(),
            distributionNumber: doc.distributionNumber,
            recipientId: doc.recipientId.toString(),
            recipientName: doc.recipientName,
            recipientType: doc.recipientType,
            items: doc.items.map((item) => ({
                itemName: item.itemName,
                requestedQuantity: item.requestedQuantity,
                unit: item.unit
            })),
            status: doc.status,
            createdBy: {
                id: doc.createdBy.id.toString(),
                name: doc.createdBy.name
            },
            notes: doc.notes,
            reservedAt: doc.reservedAt,
            completedAt: doc.completedAt,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        });
    }
    async create(distribution) {
        const createdDoc = await DistributionModel_1.DistributionModel.create({
            distributionNumber: distribution.distributionNumber,
            recipientId: distribution.recipientId,
            recipientName: distribution.recipientName,
            recipientType: distribution.recipientType,
            items: distribution.items,
            status: distribution.status,
            createdBy: distribution.createdBy,
            notes: distribution.notes
        });
        return this.mapDocumentToEntity(createdDoc);
    }
    async findById(id) {
        let doc = null;
        if (mongoose_1.default.Types.ObjectId.isValid(id)) {
            doc = await DistributionModel_1.DistributionModel.findById(id);
        }
        if (!doc) {
            doc = await DistributionModel_1.DistributionModel.findOne({ distributionNumber: id });
        }
        if (!doc)
            return null;
        return this.mapDocumentToEntity(doc);
    }
    async findAll(filter) {
        const query = {};
        if (filter?.search) {
            const regex = new RegExp(filter.search, 'i');
            query.$or = [
                { distributionNumber: regex },
                { recipientName: regex }
            ];
        }
        if (filter?.status && filter.status !== 'all') {
            query.status = filter.status;
        }
        if (filter?.recipientId) {
            query.recipientId = filter.recipientId;
        }
        const page = filter?.page || 1;
        const limit = filter?.limit || 20;
        const skip = (page - 1) * limit;
        const [docs, total] = await Promise.all([
            DistributionModel_1.DistributionModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
            DistributionModel_1.DistributionModel.countDocuments(query)
        ]);
        return {
            distributions: docs.map((d) => this.mapDocumentToEntity(d)),
            total
        };
    }
    async updateStatus(id, status, timestamps) {
        const updateObj = { status, updatedAt: new Date() };
        if (timestamps?.reservedAt)
            updateObj.reservedAt = timestamps.reservedAt;
        if (timestamps?.completedAt)
            updateObj.completedAt = timestamps.completedAt;
        const doc = await DistributionModel_1.DistributionModel.findByIdAndUpdate(id, { $set: updateObj }, { new: true });
        if (!doc)
            return null;
        return this.mapDocumentToEntity(doc);
    }
    async sumMonthlyUnitsByRecipientId(recipientId, year, month) {
        const startOfMonth = new Date(year, month - 1, 1, 0, 0, 0, 0);
        const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);
        const matchRecipientId = mongoose_1.default.Types.ObjectId.isValid(recipientId)
            ? new mongoose_1.default.Types.ObjectId(recipientId)
            : recipientId;
        const result = await DistributionModel_1.DistributionModel.aggregate([
            {
                $match: {
                    recipientId: matchRecipientId,
                    status: { $ne: 'cancelled' },
                    createdAt: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            {
                $unwind: '$items'
            },
            {
                $group: {
                    _id: null,
                    totalUnits: { $sum: '$items.requestedQuantity' }
                }
            }
        ]);
        return result.length > 0 ? result[0].totalUnits : 0;
    }
    async count() {
        return await DistributionModel_1.DistributionModel.countDocuments();
    }
}
exports.DistributionRepository = DistributionRepository;
