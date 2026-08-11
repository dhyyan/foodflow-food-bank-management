"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationRepository = void 0;
const Reservation_1 = require("../../../domain/entities/Reservation");
const ReservationModel_1 = require("../../../frameWork/database/models/ReservationModel");
class ReservationRepository {
    async findByLotId(lotId) {
        const docs = await ReservationModel_1.ReservationModel.find({ lotId }).exec();
        return docs.map(doc => this.mapToDomain(doc));
    }
    mapToDomain(doc) {
        return new Reservation_1.Reservation({
            id: doc._id.toString(),
            distributionId: doc.distributionId,
            lotId: doc.lotId,
            lotNumber: doc.lotNumber,
            itemName: doc.itemName,
            quantity: doc.quantity,
            unit: doc.unit,
            status: doc.status,
            createdBy: doc.createdBy,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        });
    }
}
exports.ReservationRepository = ReservationRepository;
