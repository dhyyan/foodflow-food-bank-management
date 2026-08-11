"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemRepository = void 0;
const ItemModel_1 = require("../../../frameWork/database/models/ItemModel");
class ItemRepository {
    async create(itemData) {
        const item = new ItemModel_1.ItemModel(itemData);
        const savedItem = await item.save();
        return this.mapToDomain(savedItem);
    }
    async findById(id) {
        const item = await ItemModel_1.ItemModel.findById(id).exec();
        if (!item)
            return null;
        return this.mapToDomain(item);
    }
    async findAll() {
        const items = await ItemModel_1.ItemModel.find().sort({ name: 1 }).exec();
        return items.map(this.mapToDomain);
    }
    async update(id, itemData) {
        const item = await ItemModel_1.ItemModel.findByIdAndUpdate(id, { $set: itemData }, { new: true }).exec();
        if (!item)
            return null;
        return this.mapToDomain(item);
    }
    async delete(id) {
        const result = await ItemModel_1.ItemModel.findByIdAndDelete(id).exec();
        return result !== null;
    }
    mapToDomain(doc) {
        return {
            id: doc._id.toString(),
            name: doc.name,
            category: doc.category,
            unit: doc.unit,
            isPerishable: doc.isPerishable,
            shelfLifeDays: doc.shelfLifeDays,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }
}
exports.ItemRepository = ItemRepository;
