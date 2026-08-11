import { IItemRepository } from '../../domain/interface/repositoryInterface/IItemRepository';
import { ItemResponseDTO } from '../../domain/interface/DTOs/ItemDTO';

export class GetItemsUseCase {
  constructor(private readonly itemRepository: IItemRepository) {}

  async execute(): Promise<ItemResponseDTO[]> {
    const items = await this.itemRepository.findAll();
    return items as ItemResponseDTO[];
  }
}
