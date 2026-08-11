import nodemailer from 'nodemailer';
import { IEmailService, ExpiryAlertItem, DailyIntakeItem } from '../../../domain/interface/serviceInterface/IEmailService';

export class EmailService implements IEmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = parseInt(process.env.SMTP_PORT || '587');
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpHost && smtpUser) {
      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });
    }
  }

  async sendExpiryAlertEmail(
    toEmail: string,
    stockManagerName: string,
    expiringItems: ExpiryAlertItem[]
  ): Promise<boolean> {
    const subject = `⚠️ URGENT: ${expiringItems.length} Inventory Lots Expiring Within 48 Hours`;
    
    const itemsHtml = expiringItems
      .map(
        (item) => `
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 10px; font-weight: bold; color: #111827;">#${item.lotNumber}</td>
          <td style="padding: 10px; color: #374151;">${item.itemName} (${item.category})</td>
          <td style="padding: 10px; font-weight: bold; color: #dc2626;">${item.availableQuantity} ${item.unit}</td>
          <td style="padding: 10px; color: #6b7280;">${item.effectiveExpiryDate}</td>
          <td style="padding: 10px; font-weight: bold; color: #b91c1c;">${item.hoursRemaining} hours left</td>
        </tr>
      `
      )
      .join('');

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; background-color: #ffffff;">
        <div style="background-color: #fee2e2; border-left: 4px solid #dc2626; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
          <h2 style="color: #991b1b; margin: 0 0 5px 0;">⚠️ 48-Hour Inventory Expiry Warning</h2>
          <p style="color: #7f1d1d; margin: 0; font-size: 14px;">FoodFlow Stock Management Automated Alert System</p>
        </div>

        <p style="font-size: 15px; color: #374151;">Hello <strong>${stockManagerName}</strong>,</p>
        <p style="font-size: 14px; color: #4b5563;">
          The following <strong>${expiringItems.length} shelved lots</strong> are reaching critical expiration status within the next 48 hours. Please inspect, re-prioritize for distribution, or process status transitions immediately to minimize waste.
        </p>

        <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px; text-align: left;">
          <thead>
            <tr style="background-color: #f3f4f6; color: #374151;">
              <th style="padding: 10px;">Lot #</th>
              <th style="padding: 10px;">Item & Category</th>
              <th style="padding: 10px;">Available Qty</th>
              <th style="padding: 10px;">Expiry Date</th>
              <th style="padding: 10px;">Time Remaining</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; text-align: center;">
          Sent automatically by FoodFlow Food Bank Management System.
        </div>
      </div>
    `;

    return this.dispatchMail(toEmail, subject, htmlContent);
  }

  async sendDailyIntakeSummaryEmail(
    toEmail: string,
    coordinatorName: string,
    summaryDate: string,
    intakeItems: DailyIntakeItem[]
  ): Promise<boolean> {
    const subject = `📦 Daily Intake Summary: ${intakeItems.length} Lots Received (${summaryDate})`;

    const itemsHtml = intakeItems
      .map(
        (item) => `
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 10px; font-weight: bold; color: #059669;">#${item.donationNumber}</td>
          <td style="padding: 10px; color: #111827;">${item.donorName}</td>
          <td style="padding: 10px; font-weight: bold; color: #374151;">${item.itemName}</td>
          <td style="padding: 10px; color: #6b7280;">${item.category}</td>
          <td style="padding: 10px; font-weight: bold; color: #16a34a;">${item.quantity} ${item.unit}</td>
        </tr>
      `
      )
      .join('');

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; background-color: #ffffff;">
        <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
          <h2 style="color: #065f46; margin: 0 0 5px 0;">📦 Daily Food Intake Summary</h2>
          <p style="color: #047857; margin: 0; font-size: 14px;">FoodFlow Handout Coordinator Dispatch Report (${summaryDate})</p>
        </div>

        <p style="font-size: 15px; color: #374151;">Hello <strong>${coordinatorName}</strong>,</p>
        <p style="font-size: 14px; color: #4b5563;">
          Here is your daily intake summary of newly received food donations processed in the last 24 hours. These items are now entering stock for distribution allocation:
        </p>

        <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px; text-align: left;">
          <thead>
            <tr style="background-color: #f3f4f6; color: #374151;">
              <th style="padding: 10px;">Donation #</th>
              <th style="padding: 10px;">Donor</th>
              <th style="padding: 10px;">Item Name</th>
              <th style="padding: 10px;">Category</th>
              <th style="padding: 10px;">Received Qty</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; text-align: center;">
          Sent automatically by FoodFlow Food Bank Management System.
        </div>
      </div>
    `;

    return this.dispatchMail(toEmail, subject, htmlContent);
  }

  private async dispatchMail(to: string, subject: string, html: string): Promise<boolean> {
    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from: `"FoodFlow Alerts" <${process.env.SMTP_FROM || 'alerts@foodflow.org'}>`,
          to,
          subject,
          html
        });
        console.log(`[EmailService] Sent email to ${to}: ${subject}`);
        return true;
      } catch (err) {
        console.error(`[EmailService] SMTP send error:`, err);
        return false;
      }
    } else {
      // Simulated Email Dispatch for local dev environment
      console.log(`\n======================================================`);
      console.log(`[EmailService - SIMULATED EMAIL DISPATCH]`);
      console.log(`TO: ${to}`);
      console.log(`SUBJECT: ${subject}`);
      console.log(`======================================================\n`);
      return true;
    }
  }
}
