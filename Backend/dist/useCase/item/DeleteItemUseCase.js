"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteItemUseCase = void 0;
const AppError_1 = require("../../shared/errors/AppError");
class DeleteItemUseCase {
    itemRepository;
    constructor(itemRepository) {
        this.itemRepository = itemRepository;
    }
    async execute(id) {
        const deleted = await this.itemRepository.delete(id);
        if (!deleted) {
            throw new AppError_1.NotFoundError(`Item with ID ${id} not found`);
        }
    }
}
exports.DeleteItemUseCase = DeleteItemUseCase;
