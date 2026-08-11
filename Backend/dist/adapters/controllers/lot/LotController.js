"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LotController = void 0;
class LotController {
    getLotsUseCase;
    getLotByIdUseCase;
    transitionLotStatusUseCase;
    getLotTraceUseCase;
    constructor(getLotsUseCase, getLotByIdUseCase, transitionLotStatusUseCase, getLotTraceUseCase) {
        this.getLotsUseCase = getLotsUseCase;
        this.getLotByIdUseCase = getLotByIdUseCase;
        this.transitionLotStatusUseCase = transitionLotStatusUseCase;
        this.getLotTraceUseCase = getLotTraceUseCase;
    }
    getLots = async (req, res, next) => {
        try {
            const { search, category, status, donationId, expiryStatus, sortBy, sortOrder, page, limit } = req.query;
            const result = await this.getLotsUseCase.execute({
                search: search ? String(search) : undefined,
                category: category ? String(category) : undefined,
                status: status ? String(status) : undefined,
                donationId: donationId ? String(donationId) : undefined,
                expiryStatus: expiryStatus ? String(expiryStatus) : undefined,
                sortBy: sortBy ? String(sortBy) : undefined,
                sortOrder: sortOrder ? String(sortOrder) : undefined,
                page: page ? Number(page) : undefined,
                limit: limit ? Number(limit) : undefined
            });
            return res.status(200).json({
                success: true,
                message: 'Lots retrieved successfully',
                data: result
            });
        }
        catch (error) {
            return next(error);
        }
    };
    getLotById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const lot = await this.getLotByIdUseCase.execute(id);
            return res.status(200).json({
                success: true,
                message: 'Lot details retrieved successfully',
                data: lot
            });
        }
        catch (error) {
            return next(error);
        }
    };
    transitionStatus = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { targetStatus, notes } = req.body;
            const userId = req.user?.id || 'system';
            const userName = req.user?.name || 'Stock Manager';
            const userRole = req.user?.role;
            const result = await this.transitionLotStatusUseCase.execute(id, { targetStatus, notes }, userId, userName, userRole);
            return res.status(200).json({
                success: true,
                message: `Lot status updated to '${targetStatus}' successfully`,
                data: result
            });
        }
        catch (error) {
            return next(error);
        }
    };
    getLotTrace = async (req, res, next) => {
        try {
            const { id } = req.params;
            const result = await this.getLotTraceUseCase.execute(id);
            return res.status(200).json({
                success: true,
                message: 'Lot trace timeline retrieved successfully',
                data: result
            });
        }
        catch (error) {
            return next(error);
        }
    };
}
exports.LotController = LotController;
