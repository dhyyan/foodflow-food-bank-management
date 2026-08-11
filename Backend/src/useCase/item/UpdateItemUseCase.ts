import { IItemRepository } from '../../domain/interface/repositoryInterface/IItemRepository';
import { UpdateItemDTO, ItemResponseDTO } from '../../domain/interface/DTOs/ItemDTO';
import { NotFoundError } from '../../shared/errors/AppError';

export class UpdateItemUseCase {
  constructor(private readonly itemRepository: IItemRepository) {}

  async execute(id: string, dto: UpdateItemDTO): Promise<ItemResponseDTO> {
    const updatedItem = await this.itemRepository.update(id, dto);
    if (!updatedItem) {
      throw new NotFoundError(`Item with ID ${id} not found`);
    }
    return updatedItem as ItemResponseDTO;
  }
}
