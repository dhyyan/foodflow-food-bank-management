export interface ExpiryAlertItem {
  lotNumber: string;
  itemName: string;
  category: string;
  availableQuantity: number;
  unit: string;
  effectiveExpiryDate: string;
  hoursRemaining: number;
}

export interface DailyIntakeItem {
  donorName: string;
  donationNumber: string;
  itemName: string;
  category: string;
  quantity: number;
  unit: string;
  receivedAt: string;
}

export interface IEmailService {
  sendExpiryAlertEmail(
    toEmail: string,
    stockManagerName: string,
    expiringItems: ExpiryAlertItem[]
  ): Promise<boolean>;

  sendDailyIntakeSummaryEmail(
    toEmail: string,
    coordinatorName: string,
    summaryDate: string,
    intakeItems: DailyIntakeItem[]
  ): Promise<boolean>;
}
