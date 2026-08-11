import { UserModel } from '../models/UserModel';
import { PasswordService } from '../../service/password/PasswordService';
import { UserRole } from '../../../domain/entities/User';

export const seedInitialAdmin = async (): Promise<void> => {
  try {
    const passwordService = new PasswordService();

    // Seed default admin if missing
    const adminCount = await UserModel.countDocuments({ role: UserRole.ADMIN });
    if (adminCount === 0) {
      const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@123456';
      const passwordHash = await passwordService.hash(defaultPassword);
      await UserModel.create({
        name: 'System Admin',
        email: 'admin@foodflow.org',
        passwordHash,
        role: UserRole.ADMIN,
        isActive: true
      });
      console.log('[Seed] Initial Admin created: admin@foodflow.org');
    }

    // Seed default operational staff users if none exist
    const staffCount = await UserModel.countDocuments({ role: { $ne: UserRole.ADMIN } });
    if (staffCount === 0) {
      const clerkPass = await passwordService.hash('Clerk@123456');
      const stockPass = await passwordService.hash('Stock@123456');
      const handoutPass = await passwordService.hash('Handout@123456');

      await UserModel.create([
        {
          name: 'Sarah Clerk',
          email: 'clerk@foodflow.org',
          passwordHash: clerkPass,
          role: UserRole.DONATION_CLERK,
          isActive: true
        },
        {
          name: 'Marcus Stocker',
          email: 'stock@foodflow.org',
          passwordHash: stockPass,
          role: UserRole.STOCK_MANAGER,
          isActive: true
        },
        {
          name: 'Elena Coordinator',
          email: 'handout@foodflow.org',
          passwordHash: handoutPass,
          role: UserRole.HANDOUT_COORDINATOR,
          isActive: true
        }
      ]);
      console.log('[Seed] Initial Staff Users created (clerk, stock, handout)');
    }
  } catch (error) {
    console.error('[Seed Error] Failed to seed initial users:', error);
  }
};
