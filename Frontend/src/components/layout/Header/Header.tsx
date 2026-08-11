import React from 'react';
import { Search, Bell, Activity, Sparkles } from 'lucide-react';
import { useAppSelector } from '../../../app/hooks';

export const Header: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <header
      style={{
        height: 'var(--header-height)',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border-default)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 90,
        boxShadow: 'var(--shadow-xs)'
      }}
    >
      {/* Search Bar */}
      <div style={{ position: 'relative', width: '320px' }}>
        <Search
          size={17}
          style={{
            position: 'absolute',
            left: '0.85rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)'
          }}
        />
        <input
          type="text"
          placeholder="Search items, lots, users..."
          style={{
            width: '100%',
            padding: '0.5rem 0.85rem 0.5rem 2.4rem',
            fontSize: '0.85rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-default)',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-main)'
          }}
        />
      </div>

      {/* Header Right Widgets */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* System Health Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--primary-light)',
            border: '1px solid var(--primary-border)',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: 'var(--primary)'
          }}
        >
          <Activity size={14} className="animate-pulse" />
          <span>System Healthy (Port 5000)</span>
        </div>

        {/* Notifications Icon */}
        <button
          style={{
            position: 'relative',
            padding: '0.5rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--border-default)'
          }}
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span
            style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-red)'
            }}
          />
        </button>

        {/* AI Assist Shortcut */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.35rem 0.65rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--secondary-light)',
            color: 'var(--secondary)',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <Sparkles size={14} />
          AI FEFO Ready
        </div>

        {/* User Direct Badge */}
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
          {user?.name || 'Administrator'}
        </div>
      </div>
    </header>
  );
};
