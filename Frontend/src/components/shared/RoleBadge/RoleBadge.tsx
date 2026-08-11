import React from 'react';
import { type UserRoleType, ROLE_LABELS } from '../../../constants/roles';

export interface RoleBadgeProps {
  role: UserRoleType;
  size?: 'sm' | 'md';
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, size = 'md' }) => {
  const getStyle = () => {
    switch (role) {
      case 'admin':
        return {
          bg: '#f3e8ff',
          color: '#7e22ce',
          border: '#e9d5ff'
        };
      case 'donation_clerk':
        return {
          bg: 'var(--primary-light)',
          color: 'var(--primary)',
          border: 'var(--primary-border)'
        };
      case 'stock_manager':
        return {
          bg: 'var(--blue-light)',
          color: 'var(--accent-blue)',
          border: '#bfdbfe'
        };
      case 'handout_coordinator':
        return {
          bg: 'var(--secondary-light)',
          color: 'var(--secondary)',
          border: '#c7d2fe'
        };
      default:
        return {
          bg: 'var(--bg-subtle)',
          color: 'var(--text-muted)',
          border: 'var(--border-default)'
        };
    }
  };

  const style = getStyle();
  const label = ROLE_LABELS[role] || role;
  const padding = size === 'sm' ? '0.15rem 0.5rem' : '0.25rem 0.65rem';
  const fontSize = size === 'sm' ? '0.72rem' : '0.78rem';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding,
        fontSize,
        fontWeight: 700,
        borderRadius: 'var(--radius-full)',
        backgroundColor: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        whiteSpace: 'nowrap'
      }}
    >
      {label}
    </span>
  );
};
