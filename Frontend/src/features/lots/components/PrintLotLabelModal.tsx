import React from 'react';
import { Modal } from '../../../components/common/Modal/Modal';
import { Button } from '../../../components/common/Button/Button';
import { LotQRCodeTag } from '../../../components/shared/LotQRCodeTag/LotQRCodeTag';
import { Printer, Calendar, Layers } from 'lucide-react';
import { formatDate } from '../../../utils/date';

interface PrintLotLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  lot: {
    lotNumber: string;
    itemName: string;
    category: string;
    quantity: number;
    unit?: string;
    effectiveExpiryDate?: string;
    status: string;
  } | null;
}

export const PrintLotLabelModal: React.FC<PrintLotLabelModalProps> = ({
  isOpen,
  onClose,
  lot
}) => {
  if (!lot) return null;

  const qrPayload = `foodflow://lots/${lot.lotNumber}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Inventory Lot QR Label: #${lot.lotNumber}`} maxWidth="500px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center' }}>
        {/* Printable Label Tag Sheet */}
        <div
          id="printable-lot-tag"
          style={{
            width: '100%',
            maxWidth: '380px',
            backgroundColor: '#ffffff',
            border: '2px solid #111827',
            borderRadius: '10px',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          {/* Tag Top Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e5e7eb', paddingBottom: '0.6rem' }}>
            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                FoodFlow Inventory Tag
              </span>
              <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#111827' }}>#{lot.lotNumber}</div>
            </div>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 800,
                padding: '0.2rem 0.5rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)'
              }}
            >
              {lot.category}
            </span>
          </div>

          {/* Tag Body with QR Code & Metadata */}
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <LotQRCodeTag value={qrPayload} size={110} />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#6b7280', display: 'block' }}>Item Description:</span>
                <strong style={{ fontSize: '1rem', color: '#111827' }}>{lot.itemName}</strong>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Layers size={14} style={{ color: 'var(--primary)' }} />
                <span style={{ fontWeight: 700, color: '#111827' }}>{lot.quantity} {lot.unit || 'units'}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={14} style={{ color: '#dc2626' }} />
                <span style={{ fontSize: '0.8rem', color: '#991b1b', fontWeight: 700 }}>
                  Exp: {lot.effectiveExpiryDate ? formatDate(lot.effectiveExpiryDate) : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Barcode Strip */}
          <div style={{ textAlign: 'center', paddingTop: '0.5rem', borderTop: '1px dashed #d1d5db' }}>
            <div style={{ fontFamily: 'monospace', letterSpacing: '0.3em', fontSize: '0.9rem', fontWeight: 800, color: '#374151' }}>
              ||| | |||| || | ||| |||| | ||
            </div>
            <span style={{ fontSize: '0.65rem', color: '#9ca3af' }}>SCANNABLE FOODFLOW QR / BARCODE TAG</span>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', width: '100%', paddingTop: '0.5rem' }}>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" leftIcon={<Printer size={16} />} onClick={handlePrint}>
            Print QR Tag
          </Button>
        </div>
      </div>
    </Modal>
  );
};
