"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationRepository = void 0;
const Reservation_1 = require("../../../domain/entities/Reservation");
const ReservationModel_1 = require("../../../frameWork/database/models/ReservationModel");
class ReservationRepository {
    mapDocumentToEntity(doc) {
        return new Reservation_1.Reservation({
            id: doc._id.toString(),
            distributionId: doc.distributionId.toString(),
            lotId: doc.lotId.toString(),
            lotNumber: doc.lotNumber,
            itemName: doc.itemName,
            quantity: doc.quantity,
            unit: doc.unit,
            status: doc.status,
            createdBy: {
                id: doc.createdBy.id.toString(),
                name: doc.createdBy.name
            },
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        });
    }
    async createMany(reservations) {
        if (reservations.length === 0)
            return [];
        const docList = reservations.map((r) => ({
            distributionId: r.distributionId,
            lotId: r.lotId,
            lotNumber: r.lotNumber,
            itemName: r.itemName,
            quantity: r.quantity,
            unit: r.unit,
            status: r.status,
            createdBy: r.createdBy
        }));
        const createdDocs = await ReservationModel_1.ReservationModel.insertMany(docList);
        return createdDocs.map((d) => this.mapDocumentToEntity(d));
    }
    async findByDistributionId(distributionId) {
        const docs = await ReservationModel_1.ReservationModel.find({ distributionId }).sort({ createdAt: 1 });
        return docs.map((d) => this.mapDocumentToEntity(d));
    }
    async findByLotId(lotId) {
        const docs = await ReservationModel_1.ReservationModel.find({ lotId }).sort({ createdAt: -1 });
        return docs.map((d) => this.mapDocumentToEntity(d));
    }
    async updateStatusByDistributionId(distributionId, status) {
        const result = await ReservationModel_1.ReservationModel.updateMany({ distributionId }, { $set: { status, updatedAt: new Date() } });
        return result.modifiedCount > 0;
    }
}
exports.ReservationRepository = ReservationRepository;
