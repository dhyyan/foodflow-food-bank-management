import React, { type InputHTMLAttributes, type ReactNode } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%' }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--text-main)'
          }}
        >
          {label}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
        {leftIcon && (
          <div style={{ position: 'absolute', left: '0.75rem', color: 'var(--text-muted)', display: 'flex' }}>
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          style={{
            width: '100%',
            padding: '0.6rem 0.85rem',
            paddingLeft: leftIcon ? '2.35rem' : '0.85rem',
            paddingRight: rightIcon ? '2.35rem' : '0.85rem',
            fontSize: '0.9rem',
            borderRadius: 'var(--radius-md)',
            border: error ? '1px solid var(--accent-red)' : '1px solid var(--border-default)',
            backgroundColor: '#ffffff',
            color: 'var(--text-main)',
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease'
          }}
          className={className}
          {...props}
        />
        {rightIcon && (
          <div style={{ position: 'absolute', right: '0.75rem', color: 'var(--text-muted)', display: 'flex' }}>
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <span style={{ fontSize: '0.78rem', color: 'var(--accent-red)', fontWeight: 500 }}>
          {error}
        </span>
      )}
      {helperText && !error && (
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          {helperText}
        </span>
      )}
    </div>
  );
};
