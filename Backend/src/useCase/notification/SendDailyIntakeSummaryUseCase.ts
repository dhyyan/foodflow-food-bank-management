import { IEmailService, DailyIntakeItem } from '../../domain/interface/serviceInterface/IEmailService';
import { DonationModel } from '../../frameWork/database/models/DonationModel';
import { LotModel } from '../../frameWork/database/models/LotModel';
import { UserModel } from '../../frameWork/database/models/UserModel';
import { NotificationLogModel } from '../../frameWork/database/models/NotificationLogModel';
import { UserRole } from '../../domain/entities/User';

export class SendDailyIntakeSummaryUseCase {
  constructor(private readonly emailService: IEmailService) {}

  async execute(): Promise<{
    processedCount: number;
    sentLogs: any[];
    intakeItemsCount: number;
  }> {
    const past24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const todayStr = new Date().toISOString().split('T')[0];

    // Find donations created within past 24h
    const recentDonationDocs = await DonationModel.find({
      createdAt: { $gte: past24h }
    }).sort({ createdAt: -1 });

    const donationIds = recentDonationDocs.map(d => d._id);

    // Find lots generated from these donations
    const recentLotDocs = await LotModel.find({
      $or: [
        { donationId: { $in: donationIds } },
        { createdAt: { $gte: past24h } }
      ]
    });

    const intakeItems: DailyIntakeItem[] = [];

    for (const lot of recentLotDocs) {
      const parentDonation = recentDonationDocs.find(
        d => d._id.toString() === lot.donationId?.toString()
      );

      intakeItems.push({
        donationNumber: parentDonation ? parentDonation.donationNumber : `INT-${lot.lotNumber}`,
        donorName: parentDonation ? parentDonation.donorName : 'Community Donation Intake',
        itemName: lot.itemName,
        category: lot.category,
        quantity: lot.quantity,
        unit: lot.unit || 'units',
        receivedAt: lot.receivedDate ? new Date(lot.receivedDate).toISOString().split('T')[0] : todayStr
      });
    }

    if (intakeItems.length === 0) {
      // Create a default fallback item if no intake in last 24h for demonstration
      intakeItems.push({
        donationNumber: 'DON-REC-TODAY',
        donorName: 'Daily Intake Log',
        itemName: 'Intake Standing Inventory',
        category: 'All Categories',
        quantity: 0,
        unit: 'units',
        receivedAt: todayStr
      });
    }

    // Find Handout Coordinators & Admins
    const coordinators = await UserModel.find({
      role: { $in: [UserRole.HANDOUT_COORDINATOR, UserRole.ADMIN] }
    });

    const sentLogs: any[] = [];

    for (const coord of coordinators) {
      const success = await this.emailService.sendDailyIntakeSummaryEmail(
        coord.email,
        coord.name,
        todayStr,
        intakeItems
      );

      const logDoc = await NotificationLogModel.create({
        type: 'DAILY_INTAKE_SUMMARY',
        recipientEmail: coord.email,
        recipientName: coord.name,
        recipientRole: coord.role,
        subject: `Daily Intake Summary: ${intakeItems.length} Lots`,
        status: success ? 'sent' : 'failed',
        payloadSummary: `Summary sent with ${intakeItems.length} intake lots processed in 24h`,
        itemCount: intakeItems.length,
        sentAt: new Date()
      });

      sentLogs.push(logDoc);
    }

    return {
      processedCount: coordinators.length,
      sentLogs,
      intakeItemsCount: intakeItems.length
    };
  }
}
