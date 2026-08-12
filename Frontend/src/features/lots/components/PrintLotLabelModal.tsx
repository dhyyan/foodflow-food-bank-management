import React from 'react';
import Barcode from 'react-barcode';
import { Modal } from '../../../components/common/Modal/Modal';
import { Button } from '../../../components/common/Button/Button';
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Inventory Lot Barcode Label: #${lot.lotNumber}`} maxWidth="500px">
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

          {/* Tag Body Metadata */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#6b7280', display: 'block' }}>Item Description:</span>
              <strong style={{ fontSize: '1rem', color: '#111827' }}>{lot.itemName}</strong>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginTop: '0.25rem' }}>
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
          <div style={{ textAlign: 'center', paddingTop: '0.75rem', borderTop: '1px dashed #d1d5db', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Barcode
              value={lot.lotNumber}
              format="CODE128"
              width={1.5}
              height={45}
              fontSize={13}
              margin={0}
              background="transparent"
            />
            <span style={{ fontSize: '0.65rem', color: '#9ca3af', marginTop: '0.25rem' }}>SCANNABLE FOODFLOW BARCODE TAG</span>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', width: '100%', paddingTop: '0.5rem' }}>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" leftIcon={<Printer size={16} />} onClick={handlePrint}>
            Print Barcode Label
          </Button>
        </div>
      </div>
    </Modal>
  );
};
