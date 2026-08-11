import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'An error occurred while loading data. Please try again.',
  onRetry
}) => {
  return (
    <div
      style={{
        padding: '1.25rem 1.5rem',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--red-light)',
        border: '1px solid var(--red-border)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.85rem'
      }}
    >
      <AlertCircle size={20} style={{ color: 'var(--accent-red)', flexShrink: 0, marginTop: '2px' }} />
      <div style={{ flex: 1 }}>
        <h5 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--accent-red)', marginBottom: '0.2rem' }}>
          {title}
        </h5>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', opacity: 0.9 }}>
          {message}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            style={{
              marginTop: '0.65rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: 'var(--accent-red)',
              textDecoration: 'underline'
            }}
          >
            <RefreshCw size={13} />
            Try again
          </button>
        )}
      </div>
    </div>
  );
};
