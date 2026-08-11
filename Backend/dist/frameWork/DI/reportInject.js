"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportController = void 0;
const GetWasteReportUseCase_1 = require("../../useCase/report/GetWasteReportUseCase");
const ReportController_1 = require("../../adapters/controllers/report/ReportController");
const getWasteReportUseCase = new GetWasteReportUseCase_1.GetWasteReportUseCase();
exports.reportController = new ReportController_1.ReportController(getWasteReportUseCase);
