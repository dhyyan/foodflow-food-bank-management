"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateItemUseCase = void 0;
const AppError_1 = require("../../shared/errors/AppError");
class UpdateItemUseCase {
    itemRepository;
    constructor(itemRepository) {
        this.itemRepository = itemRepository;
    }
    async execute(id, dto) {
        const updatedItem = await this.itemRepository.update(id, dto);
        if (!updatedItem) {
            throw new AppError_1.NotFoundError(`Item with ID ${id} not found`);
        }
        return updatedItem;
    }
}
exports.UpdateItemUseCase = UpdateItemUseCase;
