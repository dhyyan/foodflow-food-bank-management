import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface LotQRCodeTagProps {
  value: string;
  size?: number;
}

export const LotQRCodeTag: React.FC<LotQRCodeTagProps> = ({ value, size = 120 }) => {
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
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'var(--shadow-xs)'
      }}
    >
      <QRCodeSVG
        value={value}
        size={size - 12}
        level="M"
        bgColor="#ffffff"
        fgColor="#111827"
      />
    </div>
  );
};
