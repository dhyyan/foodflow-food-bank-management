import { GetWasteReportUseCase } from '../../useCase/report/GetWasteReportUseCase';
import { ReportController } from '../../adapters/controllers/report/ReportController';

const getWasteReportUseCase = new GetWasteReportUseCase();
export const reportController = new ReportController(getWasteReportUseCase);
