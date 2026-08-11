import { IItemRepository } from '../../domain/interface/repositoryInterface/IItemRepository';
import { ItemResponseDTO } from '../../domain/interface/DTOs/ItemDTO';
import { NotFoundError } from '../../shared/errors/AppError';

export class GetItemByIdUseCase {
  constructor(private readonly itemRepository: IItemRepository) {}

  async execute(id: string): Promise<ItemResponseDTO> {
    const item = await this.itemRepository.findById(id);
    if (!item) {
      throw new NotFoundError(`Item with ID ${id} not found`);
    }
    return item as ItemResponseDTO;
  }
}
