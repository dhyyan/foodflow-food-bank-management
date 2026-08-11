"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DistributionController = void 0;
const DistributionModel_1 = require("../../../frameWork/database/models/DistributionModel");
class DistributionController {
    previewAllocationUseCase;
    createDistributionUseCase;
    constructor(previewAllocationUseCase, createDistributionUseCase) {
        this.previewAllocationUseCase = previewAllocationUseCase;
        this.createDistributionUseCase = createDistributionUseCase;
    }
    previewAllocation = async (req, res, next) => {
        try {
            const result = await this.previewAllocationUseCase.execute(req.body);
            res.status(200).json({
                success: true,
                message: 'Distribution lot allocation preview generated successfully',
                data: result
            });
        }
        catch (error) {
            next(error);
        }
    };
    createDistribution = async (req, res, next) => {
        try {
            const user = req.user;
            const performedBy = {
                id: user.id,
                name: user.name || user.email,
                role: user.role
            };
            const result = await this.createDistributionUseCase.execute(req.body, performedBy);
            res.status(201).json({
                success: true,
                message: 'Distribution order created and stock reserved successfully',
                data: result
            });
        }
        catch (error) {
            next(error);
        }
    };
    listDistributions = async (_req, res, next) => {
        try {
            const docs = await DistributionModel_1.DistributionModel.find().sort({ createdAt: -1 });
            res.status(200).json({
                success: true,
                data: docs
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.DistributionController = DistributionController;
