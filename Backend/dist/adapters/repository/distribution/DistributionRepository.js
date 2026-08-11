"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DistributionRepository = void 0;
const Distribution_1 = require("../../../domain/entities/Distribution");
const DistributionModel_1 = require("../../../frameWork/database/models/DistributionModel");
class DistributionRepository {
    async findById(id) {
        const doc = await DistributionModel_1.DistributionModel.findById(id).exec();
        if (!doc)
            return null;
        return this.mapToDomain(doc);
    }
    mapToDomain(doc) {
        return new Distribution_1.Distribution({
            id: doc._id.toString(),
            distributionNumber: doc.distributionNumber,
            recipientId: doc.recipientId,
            recipientName: doc.recipientName,
            recipientType: doc.recipientType,
            items: doc.items.map(item => ({
                itemName: item.itemName,
                requestedQuantity: item.requestedQuantity,
                unit: item.unit
            })),
            status: doc.status,
            notes: doc.notes,
            createdBy: doc.createdBy,
            reservedAt: doc.reservedAt,
            completedAt: doc.completedAt,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        });
    }
}
exports.DistributionRepository = DistributionRepository;
