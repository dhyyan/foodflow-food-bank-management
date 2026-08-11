import React from 'react';
import { Loader2 } from 'lucide-react';

export interface LoaderProps {
  text?: string;
  size?: number;
  fullPage?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({
  text = 'Loading...',
  size = 28,
  fullPage = false
}) => {
  const content = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        padding: fullPage ? '0' : '2rem'
      }}
    >
      <Loader2
        size={size}
        style={{
          color: 'var(--primary)',
          animation: 'spin 1s linear infinite'
        }}
      />
      {text && (
        <span
          style={{
            fontSize: '0.88rem',
            fontWeight: 500,
            color: 'var(--text-muted)'
          }}
        >
          {text}
        </span>
      )}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  if (fullPage) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999
        }}
      >
        {content}
      </div>
    );
  }

  return content;
};
