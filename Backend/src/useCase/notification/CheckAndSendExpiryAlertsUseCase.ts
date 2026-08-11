import { IEmailService, ExpiryAlertItem } from '../../domain/interface/serviceInterface/IEmailService';
import { LotModel } from '../../frameWork/database/models/LotModel';
import { UserModel } from '../../frameWork/database/models/UserModel';
import { NotificationLogModel } from '../../frameWork/database/models/NotificationLogModel';
import { UserRole } from '../../domain/entities/User';

export class CheckAndSendExpiryAlertsUseCase {
  constructor(private readonly emailService: IEmailService) {}

  async execute(): Promise<{
    processedCount: number;
    sentLogs: any[];
    expiringItemsCount: number;
  }> {
    const now = new Date();
    const future48h = new Date(Date.now() + 48 * 60 * 60 * 1000);

    // Find all active in-stock lots expiring within the next 48 hours
    const expiringLotDocs = await LotModel.find({
      status: 'shelved',
      availableQuantity: { $gt: 0 },
      effectiveExpiryDate: { $gte: now, $lte: future48h }
    }).sort({ effectiveExpiryDate: 1 });

    if (expiringLotDocs.length === 0) {
      return { processedCount: 0, sentLogs: [], expiringItemsCount: 0 };
    }

    const expiringItems: ExpiryAlertItem[] = expiringLotDocs.map((lot) => {
      const expiryTime = lot.effectiveExpiryDate ? new Date(lot.effectiveExpiryDate).getTime() : Date.now();
      const hoursRemaining = Math.max(0, Math.round((expiryTime - Date.now()) / (1000 * 60 * 60)));

      return {
        lotNumber: lot.lotNumber,
        itemName: lot.itemName,
        category: lot.category,
        availableQuantity: lot.availableQuantity,
        unit: lot.unit || 'units',
        effectiveExpiryDate: lot.effectiveExpiryDate ? lot.effectiveExpiryDate.toISOString().split('T')[0] : 'N/A',
        hoursRemaining
      };
    });

    // Find all Stock Managers & Admins to receive warning email
    const recipientUsers = await UserModel.find({
      role: { $in: [UserRole.STOCK_MANAGER, UserRole.ADMIN] }
    });

    const sentLogs: any[] = [];

    for (const manager of recipientUsers) {
      const success = await this.emailService.sendExpiryAlertEmail(
        manager.email,
        manager.name,
        expiringItems
      );

      const logDoc = await NotificationLogModel.create({
        type: 'EXPIRY_ALERT_48H',
        recipientEmail: manager.email,
        recipientName: manager.name,
        recipientRole: manager.role,
        subject: `48-Hour Expiry Alert: ${expiringItems.length} Lots`,
        status: success ? 'sent' : 'failed',
        payloadSummary: `Alert sent for ${expiringItems.length} lots expiring in <48h (${expiringItems.map(i => i.itemName).slice(0, 3).join(', ')})`,
        itemCount: expiringItems.length,
        sentAt: new Date()
      });

      sentLogs.push(logDoc);
    }

    return {
      processedCount: recipientUsers.length,
      sentLogs,
      expiringItemsCount: expiringItems.length
    };
  }
}
