import { IItemRepository } from '../../domain/interface/repositoryInterface/IItemRepository';
import { CreateItemDTO, ItemResponseDTO } from '../../domain/interface/DTOs/ItemDTO';

export class CreateItemUseCase {
  constructor(private readonly itemRepository: IItemRepository) {}

  async execute(dto: CreateItemDTO): Promise<ItemResponseDTO> {
    const createdItem = await this.itemRepository.create(dto);
    return createdItem as ItemResponseDTO;
  }
}
