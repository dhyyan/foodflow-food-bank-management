import { IItemRepository } from '../../domain/interface/repositoryInterface/IItemRepository';
import { NotFoundError } from '../../shared/errors/AppError';

export class DeleteItemUseCase {
  constructor(private readonly itemRepository: IItemRepository) {}

  async execute(id: string): Promise<void> {
    const deleted = await this.itemRepository.delete(id);
    if (!deleted) {
      throw new NotFoundError(`Item with ID ${id} not found`);
    }
  }
}
