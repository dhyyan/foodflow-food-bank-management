"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiController = exports.aiManifestService = void 0;
const AIManifestService_1 = require("../service/ai/AIManifestService");
const ParseManifestUseCase_1 = require("../../useCase/ai/ParseManifestUseCase");
const AIController_1 = require("../../adapters/controllers/ai/AIController");
exports.aiManifestService = new AIManifestService_1.AIManifestService();
const parseManifestUseCase = new ParseManifestUseCase_1.ParseManifestUseCase(exports.aiManifestService);
exports.aiController = new AIController_1.AIController(parseManifestUseCase);
