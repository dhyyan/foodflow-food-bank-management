import React, { type ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'var(--primary)',
          color: '#ffffff',
          border: '1px solid var(--primary)'
        };
      case 'secondary':
        return {
          backgroundColor: 'var(--secondary)',
          color: '#ffffff',
          border: '1px solid var(--secondary)'
        };
      case 'outline':
        return {
          backgroundColor: '#ffffff',
          color: 'var(--text-main)',
          border: '1px solid var(--border-default)'
        };
      case 'danger':
        return {
          backgroundColor: 'var(--accent-red)',
          color: '#ffffff',
          border: '1px solid var(--accent-red)'
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: 'var(--text-muted)',
          border: '1px solid transparent'
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { padding: '0.4rem 0.85rem', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)' };
      case 'lg':
        return { padding: '0.75rem 1.5rem', fontSize: '1rem', borderRadius: 'var(--radius-md)' };
      default:
        return { padding: '0.55rem 1.15rem', fontSize: '0.9rem', borderRadius: 'var(--radius-md)' };
    }
  };

  return (
    <button
      disabled={disabled || isLoading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        fontWeight: 600,
        transition: 'all 0.15s ease',
        boxShadow: variant !== 'ghost' ? 'var(--shadow-xs)' : 'none',
        ...getVariantStyles(),
        ...getSizeStyles()
      }}
      className={className}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="animate-spin" size={size === 'sm' ? 14 : 18} />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};
