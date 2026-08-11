import React, { type ReactNode } from 'react';

export interface PageContainerProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  title,
  subtitle,
  actions,
  children
}) => {
  return (
    <div className="page-body animate-fade-in">
      {/* Page Title & Action Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.75rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '1.65rem',
              fontWeight: 800,
              color: 'var(--text-main)',
              letterSpacing: '-0.02em',
              margin: 0
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>{actions}</div>}
      </div>

      {/* Children Content */}
      <div>{children}</div>
    </div>
  );
};
