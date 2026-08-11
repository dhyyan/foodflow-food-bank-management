"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetItemsUseCase = void 0;
class GetItemsUseCase {
    itemRepository;
    constructor(itemRepository) {
        this.itemRepository = itemRepository;
    }
    async execute() {
        const items = await this.itemRepository.findAll();
        return items;
    }
}
exports.GetItemsUseCase = GetItemsUseCase;
