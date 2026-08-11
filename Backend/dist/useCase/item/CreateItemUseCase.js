"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateItemUseCase = void 0;
class CreateItemUseCase {
    itemRepository;
    constructor(itemRepository) {
        this.itemRepository = itemRepository;
    }
    async execute(dto) {
        const createdItem = await this.itemRepository.create(dto);
        return createdItem;
    }
}
exports.CreateItemUseCase = CreateItemUseCase;
