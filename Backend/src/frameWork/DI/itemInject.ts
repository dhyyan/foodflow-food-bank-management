import { ItemRepository } from '../../adapters/repository/item/ItemRepository';
import { CreateItemUseCase } from '../../useCase/item/CreateItemUseCase';
import { UpdateItemUseCase } from '../../useCase/item/UpdateItemUseCase';
import { GetItemsUseCase } from '../../useCase/item/GetItemsUseCase';
import { GetItemByIdUseCase } from '../../useCase/item/GetItemByIdUseCase';
import { DeleteItemUseCase } from '../../useCase/item/DeleteItemUseCase';
import { ItemController } from '../../adapters/controllers/item/ItemController';

const itemRepository = new ItemRepository();

const createItemUseCase = new CreateItemUseCase(itemRepository);
const updateItemUseCase = new UpdateItemUseCase(itemRepository);
const getItemsUseCase = new GetItemsUseCase(itemRepository);
const getItemByIdUseCase = new GetItemByIdUseCase(itemRepository);
const deleteItemUseCase = new DeleteItemUseCase(itemRepository);

export const itemController = new ItemController(
  createItemUseCase,
  updateItemUseCase,
  getItemsUseCase,
  getItemByIdUseCase,
  deleteItemUseCase
);
