import React from 'react';

export interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const normalized = status.toLowerCase();

  const getStyle = () => {
    switch (normalized) {
      case 'active':
      case 'shelved':
      case 'released':
        return {
          bg: 'var(--primary-light)',
          color: 'var(--primary)',
          border: 'var(--primary-border)'
        };
      case 'pending':
      case 'received':
      case 'checked':
        return {
          bg: 'var(--amber-light)',
          color: 'var(--accent-amber)',
          border: 'var(--amber-border)'
        };
      case 'reserved':
        return {
          bg: 'var(--blue-light)',
          color: 'var(--accent-blue)',
          border: '#bfdbfe'
        };
      case 'inactive':
      case 'quarantined':
      case 'discarded':
      case 'expired':
        return {
          bg: 'var(--red-light)',
          color: 'var(--accent-red)',
          border: 'var(--red-border)'
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
  const padding = size === 'sm' ? '0.15rem 0.5rem' : '0.25rem 0.65rem';
  const fontSize = size === 'sm' ? '0.72rem' : '0.78rem';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding,
        fontSize,
        fontWeight: 700,
        borderRadius: 'var(--radius-full)',
        backgroundColor: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        textTransform: 'capitalize',
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap'
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: style.color
        }}
      />
      {status}
    </span>
  );
};
