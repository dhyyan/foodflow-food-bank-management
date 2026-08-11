import React, { type SelectHTMLAttributes } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string | null;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  id,
  className = '',
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%' }}>
      {label && (
        <label
          htmlFor={selectId}
          style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--text-main)'
          }}
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        style={{
          width: '100%',
          padding: '0.65rem 0.85rem',
          fontSize: '0.9rem',
          borderRadius: 'var(--radius-md)',
          border: error ? '1px solid var(--accent-red)' : '1px solid var(--border-default)',
          backgroundColor: '#ffffff',
          color: 'var(--text-main)',
          cursor: 'pointer'
        }}
        className={className}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <span style={{ fontSize: '0.78rem', color: 'var(--accent-red)', fontWeight: 500 }}>
          {error}
        </span>
      )}
    </div>
  );
};
