import { Request, Response, NextFunction } from 'express';
import { IGetWasteReportUseCase } from '../../../useCase/report/GetWasteReportUseCase';

export class ReportController {
  constructor(private readonly getWasteReportUseCase: IGetWasteReportUseCase) {}

  getWasteReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { startDate, endDate, category } = req.query;
      const report = await this.getWasteReportUseCase.execute({
        startDate: startDate as string,
        endDate: endDate as string,
        category: category as string
      });

      res.status(200).json({
        success: true,
        message: 'Waste report generated successfully',
        data: report
      });
    } catch (error) {
      next(error);
    }
  };
}
