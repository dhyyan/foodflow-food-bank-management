import { Request, Response, NextFunction } from 'express';
import { CheckAndSendExpiryAlertsUseCase } from '../../../useCase/notification/CheckAndSendExpiryAlertsUseCase';
import { SendDailyIntakeSummaryUseCase } from '../../../useCase/notification/SendDailyIntakeSummaryUseCase';
import { NotificationLogModel } from '../../../frameWork/database/models/NotificationLogModel';

export class NotificationController {
  constructor(
    private readonly checkAndSendExpiryAlertsUseCase: CheckAndSendExpiryAlertsUseCase,
    private readonly sendDailyIntakeSummaryUseCase: SendDailyIntakeSummaryUseCase
  ) {}

  triggerExpiryAlerts = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.checkAndSendExpiryAlertsUseCase.execute();
      res.status(200).json({
        success: true,
        message: `48-hour expiry check completed. Sent alerts to ${result.processedCount} Stock Managers for ${result.expiringItemsCount} expiring lots.`,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  triggerDailySummary = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.sendDailyIntakeSummaryUseCase.execute();
      res.status(200).json({
        success: true,
        message: `Daily intake summary generated and sent to ${result.processedCount} Handout Coordinators for ${result.intakeItemsCount} intake items.`,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  getHistory = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const logs = await NotificationLogModel.find().sort({ sentAt: -1 }).limit(50);
      res.status(200).json({
        success: true,
        data: logs
      });
    } catch (error) {
      next(error);
    }
  };
}
