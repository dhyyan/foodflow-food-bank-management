"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportController = void 0;
class ReportController {
    getWasteReportUseCase;
    constructor(getWasteReportUseCase) {
        this.getWasteReportUseCase = getWasteReportUseCase;
    }
    getWasteReport = async (req, res, next) => {
        try {
            const { startDate, endDate, category } = req.query;
            const report = await this.getWasteReportUseCase.execute({
                startDate: startDate,
                endDate: endDate,
                category: category
            });
            res.status(200).json({
                success: true,
                message: 'Waste report generated successfully',
                data: report
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.ReportController = ReportController;
