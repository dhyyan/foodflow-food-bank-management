"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DistributionController = void 0;
class DistributionController {
    createDistributionUseCase;
    previewFEFOUseCase;
    reserveStockUseCase;
    completeDistributionUseCase;
    getDistributionByIdUseCase;
    getDistributionsUseCase;
    constructor(createDistributionUseCase, previewFEFOUseCase, reserveStockUseCase, completeDistributionUseCase, getDistributionByIdUseCase, getDistributionsUseCase) {
        this.createDistributionUseCase = createDistributionUseCase;
        this.previewFEFOUseCase = previewFEFOUseCase;
        this.reserveStockUseCase = reserveStockUseCase;
        this.completeDistributionUseCase = completeDistributionUseCase;
        this.getDistributionByIdUseCase = getDistributionByIdUseCase;
        this.getDistributionsUseCase = getDistributionsUseCase;
    }
    create = async (req, res, next) => {
        try {
            const creator = {
                id: req.user.id,
                name: req.user.name
            };
            const dto = {
                recipientId: req.body.recipientId,
                items: req.body.items,
                notes: req.body.notes
            };
            const distribution = await this.createDistributionUseCase.execute(dto, creator);
            res.status(201).json({
                success: true,
                message: 'Distribution request created successfully',
                data: distribution
            });
        }
        catch (error) {
            next(error);
        }
    };
    previewFEFO = async (req, res, next) => {
        try {
            const { id } = req.params;
            const preview = await this.previewFEFOUseCase.execute(id);
            res.status(200).json({
                success: true,
                message: 'FEFO allocation preview generated successfully',
                data: preview
            });
        }
        catch (error) {
            next(error);
        }
    };
    reserve = async (req, res, next) => {
        try {
            const { id } = req.params;
            const coordinator = {
                id: req.user.id,
                name: req.user.name
            };
            const result = await this.reserveStockUseCase.execute(id, coordinator);
            res.status(200).json({
                success: true,
                message: 'Inventory reserved successfully according to FEFO policy',
                data: result
            });
        }
        catch (error) {
            next(error);
        }
    };
    complete = async (req, res, next) => {
        try {
            const { id } = req.params;
            const coordinator = {
                id: req.user.id,
                name: req.user.name
            };
            const result = await this.completeDistributionUseCase.execute(id, coordinator);
            res.status(200).json({
                success: true,
                message: 'Distribution completed and stock released successfully',
                data: result
            });
        }
        catch (error) {
            next(error);
        }
    };
    getById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const distribution = await this.getDistributionByIdUseCase.execute(id);
            res.status(200).json({
                success: true,
                message: 'Distribution details retrieved successfully',
                data: distribution
            });
        }
        catch (error) {
            next(error);
        }
    };
    getAll = async (req, res, next) => {
        try {
            const filter = {
                search: req.query.search,
                status: req.query.status,
                recipientId: req.query.recipientId,
                page: req.query.page ? Number(req.query.page) : undefined,
                limit: req.query.limit ? Number(req.query.limit) : undefined
            };
            const { distributions, total } = await this.getDistributionsUseCase.execute(filter);
            res.status(200).json({
                success: true,
                message: 'Distributions retrieved successfully',
                data: distributions,
                meta: {
                    total,
                    page: filter.page || 1,
                    limit: filter.limit || 20
                }
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.DistributionController = DistributionController;
