"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemController = void 0;
const AppError_1 = require("../../../shared/errors/AppError");
class ItemController {
    createItemUseCase;
    updateItemUseCase;
    getItemsUseCase;
    getItemByIdUseCase;
    deleteItemUseCase;
    constructor(createItemUseCase, updateItemUseCase, getItemsUseCase, getItemByIdUseCase, deleteItemUseCase) {
        this.createItemUseCase = createItemUseCase;
        this.updateItemUseCase = updateItemUseCase;
        this.getItemsUseCase = getItemsUseCase;
        this.getItemByIdUseCase = getItemByIdUseCase;
        this.deleteItemUseCase = deleteItemUseCase;
    }
    createItem = async (req, res, next) => {
        try {
            const dto = {
                name: req.body.name,
                category: req.body.category,
                unit: req.body.unit,
                isPerishable: req.body.isPerishable,
                shelfLifeDays: req.body.shelfLifeDays,
            };
            if (!dto.name || !dto.category || !dto.unit || dto.isPerishable === undefined || dto.shelfLifeDays === undefined) {
                throw new AppError_1.BadRequestError('Missing required fields (name, category, unit, isPerishable, shelfLifeDays)');
            }
            const item = await this.createItemUseCase.execute(dto);
            res.status(201).json({
                success: true,
                message: 'Item created successfully',
                data: item,
            });
        }
        catch (error) {
            next(error);
        }
    };
    getItems = async (_req, res, next) => {
        try {
            const items = await this.getItemsUseCase.execute();
            res.status(200).json({
                success: true,
                message: 'Items retrieved successfully',
                data: items,
            });
        }
        catch (error) {
            next(error);
        }
    };
    getItemById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const item = await this.getItemByIdUseCase.execute(id);
            res.status(200).json({
                success: true,
                message: 'Item retrieved successfully',
                data: item,
            });
        }
        catch (error) {
            next(error);
        }
    };
    updateItem = async (req, res, next) => {
        try {
            const { id } = req.params;
            const dto = req.body;
            const item = await this.updateItemUseCase.execute(id, dto);
            res.status(200).json({
                success: true,
                message: 'Item updated successfully',
                data: item,
            });
        }
        catch (error) {
            next(error);
        }
    };
    deleteItem = async (req, res, next) => {
        try {
            const { id } = req.params;
            await this.deleteItemUseCase.execute(id);
            res.status(200).json({
                success: true,
                message: 'Item deleted successfully',
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.ItemController = ItemController;
