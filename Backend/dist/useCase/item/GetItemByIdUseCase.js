"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetItemByIdUseCase = void 0;
const AppError_1 = require("../../shared/errors/AppError");
class GetItemByIdUseCase {
    itemRepository;
    constructor(itemRepository) {
        this.itemRepository = itemRepository;
    }
    async execute(id) {
        const item = await this.itemRepository.findById(id);
        if (!item) {
            throw new AppError_1.NotFoundError(`Item with ID ${id} not found`);
        }
        return item;
    }
}
exports.GetItemByIdUseCase = GetItemByIdUseCase;
