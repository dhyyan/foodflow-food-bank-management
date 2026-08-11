import { UserModel } from '../models/UserModel';
import { PasswordService } from '../../service/password/PasswordService';
import { UserRole } from '../../../domain/entities/User';

export const seedInitialAdmin = async () => {
  try {
    const passwordService = new PasswordService();

    // 1. Seed System Admin
    const adminEmail = 'admin@foodflow.org';
    const existingAdmin = await UserModel.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@123456';
      const passwordHash = await passwordService.hash(defaultPassword);

      await UserModel.create({
        name: 'System Admin',
        email: adminEmail,
        passwordHash,
        role: UserRole.ADMIN,
        isActive: true
      });
      console.log(`[Seed] Initial Admin created: ${adminEmail}`);
    }

    // 2. Seed Operational Staff Users if missing
    const defaultStaff = [
      {
        name: 'Sarah Clerk',
        email: 'clerk@foodflow.org',
        password: 'Clerk@123456',
        role: UserRole.DONATION_CLERK
      },
      {
        name: 'Marcus Stocker',
        email: 'stock@foodflow.org',
        password: 'Stock@123456',
        role: UserRole.STOCK_MANAGER
      },
      {
        name: 'Elena Coordinator',
        email: 'handout@foodflow.org',
        password: 'Handout@123456',
        role: UserRole.HANDOUT_COORDINATOR
      }
    ];

    for (const staff of defaultStaff) {
      const existingUser = await UserModel.findOne({ email: staff.email });
      if (!existingUser) {
        const passwordHash = await passwordService.hash(staff.password);
        await UserModel.create({
          name: staff.name,
          email: staff.email,
          passwordHash,
          role: staff.role,
          isActive: true
        });
        console.log(`[Seed] Created staff user: ${staff.email}`);
      }
    }
  } catch (error) {
    console.error('[Seed Error] Failed to seed initial users:', error);
  }
};
