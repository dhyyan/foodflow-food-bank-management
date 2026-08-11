import { UserModel } from '../models/UserModel';
import { PasswordService } from '../../service/password/PasswordService';
import { UserRole } from '../../../domain/entities/User';

export const seedInitialAdmin = async () => {
  try {
    const adminCount = await UserModel.countDocuments({ role: UserRole.ADMIN });
    if (adminCount === 0) {
      const passwordService = new PasswordService();
      const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@123456';
      const passwordHash = await passwordService.hash(defaultPassword);

      await UserModel.create({
        name: 'System Admin',
        email: 'admin@foodflow.org',
        passwordHash,
        role: UserRole.ADMIN,
        isActive: true
      });

      console.log('====================================================');
      console.log('[Seed] Initial Admin user created:');
      console.log('       Email: admin@foodflow.org');
      console.log(`       Password: ${defaultPassword}`);
      console.log('====================================================');
    }
  } catch (error) {
    console.error('[Seed Error] Failed to seed initial admin user:', error);
  }
};
