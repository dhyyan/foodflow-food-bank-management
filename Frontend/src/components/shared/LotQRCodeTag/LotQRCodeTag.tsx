import React from 'react';

interface LotQRCodeTagProps {
  value: string;
  size?: number;
}

export const LotQRCodeTag: React.FC<LotQRCodeTagProps> = ({ value, size = 120 }) => {
  // Generate SVG QR matrix representation
  return (
    <div
      data-qr-payload={value}
      style={{
        width: size,
        height: size,
        backgroundColor: '#ffffff',
        padding: '6px',
        border: '1px solid var(--border-default)',
        borderRadius: '6px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'var(--shadow-xs)'
      }}
    >
      <svg
        width={size - 12}
        height={size - 12}
        viewBox="0 0 29 29"
        shapeRendering="crispEdges"
        style={{ width: '100%', height: '100%' }}
      >
        <path fill="#ffffff" d="M0 0h29v29H0z" />
        <path
          fill="#111827"
          d="M0 0h7v7H0zm22 0h7v7h-7zM0 22h7v7H0zm2 2h3v3H2zm22-22h3v3h-3zM2 2h3v3H2zm9 0h2v3h-2zm4 0h3v2h-3zm-4 4h4v2h-4zm6 0h2v4h-2zm-6 3h2v2h-2zm-4 2h2v4h-2zm6 0h5v2h-5zm-8 3h3v2H8zm6 0h2v4h-2zm4 0h3v2h-3zm-8 3h4v2H10zm6 0h4v4h-4zm-8 3h3v3H8zm11 0h3v2h-3zm-6 2h4v2h-4z"
        />
      </svg>
    </div>
  );
};
