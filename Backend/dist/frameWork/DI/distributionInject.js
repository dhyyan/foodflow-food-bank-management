"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.distributionController = void 0;
const PreviewAllocationUseCase_1 = require("../../useCase/distribution/PreviewAllocationUseCase");
const CreateDistributionUseCase_1 = require("../../useCase/distribution/CreateDistributionUseCase");
const DistributionController_1 = require("../../adapters/controllers/distribution/DistributionController");
const previewAllocationUseCase = new PreviewAllocationUseCase_1.PreviewAllocationUseCase();
const createDistributionUseCase = new CreateDistributionUseCase_1.CreateDistributionUseCase(previewAllocationUseCase);
exports.distributionController = new DistributionController_1.DistributionController(previewAllocationUseCase, createDistributionUseCase);
