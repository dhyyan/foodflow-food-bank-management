"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LotEventRepository = void 0;
const LotEvent_1 = require("../../../domain/entities/LotEvent");
const LotEventModel_1 = require("../../../frameWork/database/models/LotEventModel");
class LotEventRepository {
    mapDocumentToEntity(doc) {
        return new LotEvent_1.LotEvent({
            id: doc._id.toString(),
            lotId: doc.lotId.toString(),
            eventType: doc.eventType,
            previousStatus: doc.previousStatus,
            newStatus: doc.newStatus,
            performedBy: {
                id: doc.performedBy.id.toString(),
                name: doc.performedBy.name,
                role: doc.performedBy.role
            },
            notes: doc.notes,
            timestamp: doc.timestamp,
            createdAt: doc.createdAt
        });
    }
    async create(event) {
        const doc = await LotEventModel_1.LotEventModel.create({
            lotId: event.lotId,
            eventType: event.eventType,
            previousStatus: event.previousStatus,
            newStatus: event.newStatus,
            performedBy: event.performedBy,
            notes: event.notes,
            timestamp: event.timestamp || new Date()
        });
        return this.mapDocumentToEntity(doc);
    }
    async createMany(events) {
        if (events.length === 0)
            return [];
        const docDataList = events.map((event) => ({
            lotId: event.lotId,
            eventType: event.eventType,
            previousStatus: event.previousStatus,
            newStatus: event.newStatus,
            performedBy: event.performedBy,
            notes: event.notes,
            timestamp: event.timestamp || new Date()
        }));
        const docs = await LotEventModel_1.LotEventModel.insertMany(docDataList);
        return docs.map((doc) => this.mapDocumentToEntity(doc));
    }
    async findByLotId(lotId) {
        const docs = await LotEventModel_1.LotEventModel.find({ lotId }).sort({ timestamp: 1, createdAt: 1 });
        return docs.map((doc) => this.mapDocumentToEntity(doc));
    }
}
exports.LotEventRepository = LotEventRepository;
