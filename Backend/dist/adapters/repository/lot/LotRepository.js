"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LotRepository = void 0;
const Lot_1 = require("../../../domain/entities/Lot");
const LotModel_1 = require("../../../frameWork/database/models/LotModel");
const DonationModel_1 = require("../../../frameWork/database/models/DonationModel");
const mongoose_1 = __importDefault(require("mongoose"));
class LotRepository {
    mapDocumentToEntity(doc, donorInfo) {
        const lot = new Lot_1.Lot({
            id: doc._id.toString(),
            lotNumber: doc.lotNumber,
            itemName: doc.itemName,
            category: doc.category,
            quantity: doc.quantity,
            availableQuantity: doc.availableQuantity,
            unit: doc.unit,
            receivedDate: doc.receivedDate,
            printedExpiryDate: doc.printedExpiryDate,
            safetyMarginDays: doc.safetyMarginDays,
            effectiveExpiryDate: doc.effectiveExpiryDate,
            donationId: doc.donationId.toString(),
            donationLineId: doc.donationLineId ? doc.donationLineId.toString() : undefined,
            status: doc.status,
            createdBy: {
                id: doc.createdBy.id.toString(),
                name: doc.createdBy.name
            },
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        });
        if (donorInfo) {
            lot.donorName = donorInfo.donorName;
            lot.donorType = donorInfo.donorType;
        }
        return lot;
    }
    async create(lot) {
        const createdDoc = await LotModel_1.LotModel.create({
            lotNumber: lot.lotNumber,
            itemName: lot.itemName,
            category: lot.category,
            quantity: lot.quantity,
            availableQuantity: lot.availableQuantity,
            unit: lot.unit,
            receivedDate: lot.receivedDate,
            printedExpiryDate: lot.printedExpiryDate,
            safetyMarginDays: lot.safetyMarginDays,
            effectiveExpiryDate: lot.effectiveExpiryDate,
            donationId: lot.donationId,
            donationLineId: lot.donationLineId,
            status: lot.status,
            createdBy: lot.createdBy
        });
        return this.mapDocumentToEntity(createdDoc);
    }
    async createMany(lots) {
        if (lots.length === 0)
            return [];
        const docDataList = lots.map((lot) => ({
            lotNumber: lot.lotNumber,
            itemName: lot.itemName,
            category: lot.category,
            quantity: lot.quantity,
            availableQuantity: lot.availableQuantity,
            unit: lot.unit,
            receivedDate: lot.receivedDate,
            printedExpiryDate: lot.printedExpiryDate,
            safetyMarginDays: lot.safetyMarginDays,
            effectiveExpiryDate: lot.effectiveExpiryDate,
            donationId: lot.donationId,
            donationLineId: lot.donationLineId,
            status: lot.status,
            createdBy: lot.createdBy
        }));
        const createdDocs = await LotModel_1.LotModel.insertMany(docDataList);
        return createdDocs.map((doc) => this.mapDocumentToEntity(doc));
    }
    async findById(id) {
        let doc = null;
        if (mongoose_1.default.Types.ObjectId.isValid(id)) {
            doc = await LotModel_1.LotModel.findById(id);
        }
        if (!doc) {
            doc = await LotModel_1.LotModel.findOne({ lotNumber: id });
        }
        if (!doc)
            return null;
        let donorInfo = undefined;
        if (doc.donationId) {
            const donationDoc = await DonationModel_1.DonationModel.findById(doc.donationId);
            if (donationDoc) {
                donorInfo = { donorName: donationDoc.donorName, donorType: donationDoc.donorType };
            }
        }
        return this.mapDocumentToEntity(doc, donorInfo);
    }
    async findByDonationId(donationId) {
        const docs = await LotModel_1.LotModel.find({ donationId }).sort({ createdAt: 1 });
        return docs.map((doc) => this.mapDocumentToEntity(doc));
    }
    async findAll(filter) {
        const query = {};
        if (filter?.search) {
            const searchRegex = new RegExp(filter.search, 'i');
            query.$or = [
                { lotNumber: searchRegex },
                { itemName: searchRegex },
                { category: searchRegex }
            ];
        }
        if (filter?.category && filter.category !== 'all') {
            query.category = filter.category;
        }
        if (filter?.status && filter.status !== 'all') {
            query.status = filter.status;
        }
        if (filter?.donationId) {
            query.donationId = filter.donationId;
        }
        const now = new Date();
        if (filter?.expiryStatus === 'expired') {
            query.effectiveExpiryDate = { $lte: now };
        }
        else if (filter?.expiryStatus === 'expiring_soon') {
            const sevenDaysFromNow = new Date();
            sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
            query.effectiveExpiryDate = { $gt: now, $lte: sevenDaysFromNow };
        }
        const sortOptions = {};
        const sortBy = filter?.sortBy || 'receivedDate';
        const sortOrder = filter?.sortOrder === 'asc' ? 1 : -1;
        if (sortBy === 'effectiveExpiryDate') {
            sortOptions.effectiveExpiryDate = sortOrder;
        }
        else if (sortBy === 'quantity') {
            sortOptions.quantity = sortOrder;
        }
        else if (sortBy === 'lotNumber') {
            sortOptions.lotNumber = sortOrder;
        }
        else if (sortBy === 'createdAt') {
            sortOptions.createdAt = sortOrder;
        }
        else {
            sortOptions.receivedDate = sortOrder;
        }
        const page = filter?.page || 1;
        const limit = filter?.limit || 20;
        const skip = (page - 1) * limit;
        const [docs, total] = await Promise.all([
            LotModel_1.LotModel.find(query).sort(sortOptions).skip(skip).limit(limit),
            LotModel_1.LotModel.countDocuments(query)
        ]);
        // Gather unique donation IDs to enrich donorName and donorType efficiently
        const donationIds = Array.from(new Set(docs.map((d) => d.donationId.toString()).filter(Boolean)));
        const donations = await DonationModel_1.DonationModel.find({ _id: { $in: donationIds } }).select('donorName donorType');
        const donationMap = new Map();
        donations.forEach((d) => {
            donationMap.set(d._id.toString(), { donorName: d.donorName, donorType: d.donorType });
        });
        const lotEntities = docs.map((doc) => {
            const info = donationMap.get(doc.donationId.toString());
            return this.mapDocumentToEntity(doc, info);
        });
        return {
            lots: lotEntities,
            total
        };
    }
    async updateStatus(id, status) {
        const doc = await LotModel_1.LotModel.findByIdAndUpdate(id, { $set: { status, updatedAt: new Date() } }, { new: true });
        if (!doc)
            return null;
        return this.mapDocumentToEntity(doc);
    }
    async update(lot) {
        if (!lot.id)
            return null;
        const doc = await LotModel_1.LotModel.findByIdAndUpdate(lot.id, {
            $set: {
                itemName: lot.itemName,
                category: lot.category,
                quantity: lot.quantity,
                availableQuantity: lot.availableQuantity,
                unit: lot.unit,
                status: lot.status,
                printedExpiryDate: lot.printedExpiryDate,
                effectiveExpiryDate: lot.effectiveExpiryDate,
                updatedAt: new Date()
            }
        }, { new: true });
        if (!doc)
            return null;
        return this.mapDocumentToEntity(doc);
    }
    async count() {
        return await LotModel_1.LotModel.countDocuments();
    }
}
exports.LotRepository = LotRepository;
