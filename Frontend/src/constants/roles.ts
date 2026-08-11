export const ROLES = {
  ADMIN: 'admin',
  DONATION_CLERK: 'donation_clerk',
  STOCK_MANAGER: 'stock_manager',
  HANDOUT_COORDINATOR: 'handout_coordinator'
} as const;

export type UserRoleType = typeof ROLES[keyof typeof ROLES];

export const ROLE_LABELS: Record<UserRoleType, string> = {
  [ROLES.ADMIN]: 'System Admin',
  [ROLES.DONATION_CLERK]: 'Donation Clerk',
  [ROLES.STOCK_MANAGER]: 'Stock Manager',
  [ROLES.HANDOUT_COORDINATOR]: 'Handout Coordinator'
};
