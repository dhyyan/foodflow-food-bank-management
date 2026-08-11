import { EmailService } from '../../frameWork/service/email/EmailService';
import { CheckAndSendExpiryAlertsUseCase } from '../../useCase/notification/CheckAndSendExpiryAlertsUseCase';
import { SendDailyIntakeSummaryUseCase } from '../../useCase/notification/SendDailyIntakeSummaryUseCase';
import { NotificationController } from '../../adapters/controllers/notification/NotificationController';

const emailService = new EmailService();
const checkAndSendExpiryAlertsUseCase = new CheckAndSendExpiryAlertsUseCase(emailService);
const sendDailyIntakeSummaryUseCase = new SendDailyIntakeSummaryUseCase(emailService);

export const notificationController = new NotificationController(
  checkAndSendExpiryAlertsUseCase,
  sendDailyIntakeSummaryUseCase
);
