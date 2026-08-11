"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonationRepository = void 0;
const Donation_1 = require("../../../domain/entities/Donation");
const DonationModel_1 = require("../../../frameWork/database/models/DonationModel");
const mongoose_1 = __importDefault(require("mongoose"));
class DonationRepository {
    mapDocumentToEntity(doc) {
        const lines = doc.lines.map((line) => ({
            id: line._id ? line._id.toString() : undefined,
            itemName: line.itemName,
            category: line.category,
            quantity: line.quantity,
            unit: line.unit,
            printedExpiryDate: line.printedExpiryDate,
            notes: line.notes
        }));
        return new Donation_1.Donation({
            id: doc._id.toString(),
            donationNumber: doc.donationNumber,
            donorName: doc.donorName,
            donorType: doc.donorType,
            receivedAt: doc.receivedAt,
            receivedBy: {
                id: doc.receivedBy.id.toString(),
                name: doc.receivedBy.name
            },
            lines,
            notes: doc.notes,
            status: doc.status,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        });
    }
    async create(donation) {
        const docData = {
            donationNumber: donation.donationNumber,
            donorName: donation.donorName,
            donorType: donation.donorType,
            receivedAt: donation.receivedAt,
            receivedBy: donation.receivedBy,
            lines: donation.lines.map((l) => ({
                itemName: l.itemName,
                category: l.category || 'General',
                quantity: l.quantity,
                unit: l.unit,
                printedExpiryDate: l.printedExpiryDate,
                notes: l.notes
            })),
            notes: donation.notes,
            status: donation.status
        };
        const createdDoc = await DonationModel_1.DonationModel.create(docData);
        return this.mapDocumentToEntity(createdDoc);
    }
    async findById(id) {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            // Also support finding by donationNumber e.g. DON-20260811-0001
            const docByNum = await DonationModel_1.DonationModel.findOne({ donationNumber: id });
            if (!docByNum)
                return null;
            return this.mapDocumentToEntity(docByNum);
        }
        const doc = await DonationModel_1.DonationModel.findById(id);
        if (!doc)
            return null;
        return this.mapDocumentToEntity(doc);
    }
    async findAll(filter) {
        const query = {};
        if (filter?.search) {
            const searchRegex = new RegExp(filter.search, 'i');
            query.$or = [
                { donorName: searchRegex },
                { donationNumber: searchRegex },
                { 'lines.itemName': searchRegex }
            ];
        }
        if (filter?.donorType && filter.donorType !== 'all') {
            query.donorType = filter.donorType;
        }
        if (filter?.startDate || filter?.endDate) {
            query.receivedAt = {};
            if (filter.startDate)
                query.receivedAt.$gte = new Date(filter.startDate);
            if (filter.endDate)
                query.receivedAt.$lte = new Date(filter.endDate);
        }
        const page = filter?.page || 1;
        const limit = filter?.limit || 20;
        const skip = (page - 1) * limit;
        const [docs, total] = await Promise.all([
            DonationModel_1.DonationModel.find(query).sort({ receivedAt: -1 }).skip(skip).limit(limit),
            DonationModel_1.DonationModel.countDocuments(query)
        ]);
        return {
            donations: docs.map((doc) => this.mapDocumentToEntity(doc)),
            total
        };
    }
    async count() {
        return await DonationModel_1.DonationModel.countDocuments();
    }
}
exports.DonationRepository = DonationRepository;
