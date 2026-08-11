import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/common/Modal/Modal';
import { Button } from '../../../components/common/Button/Button';
import { Truck, ArrowRight, AlertTriangle } from 'lucide-react';
import apiClient from '../../../services/api/apiClient';

interface Warehouse {
  _id: string;
  code: string;
  name: string;
  location: string;
  isMainFacility: boolean;
}

interface WarehouseTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  lot: {
    id: string;
    lotNumber: string;
    itemName: string;
    availableQuantity: number;
    unit: string;
  } | null;
  onSuccess: () => void;
}

export const WarehouseTransferModal: React.FC<WarehouseTransferModalProps> = ({
  isOpen,
  onClose,
  lot,
  onSuccess
}) => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [sourceWarehouse, setSourceWarehouse] = useState('WH-MAIN');
  const [targetWarehouse, setTargetWarehouse] = useState('WH-NORTH');
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchWarehouses();
      if (lot) {
        setQuantity(lot.availableQuantity);
      }
    }
  }, [isOpen, lot]);

  const fetchWarehouses = async () => {
    try {
      const res = await apiClient.get('/warehouses');
      if (res.data && res.data.data) {
        setWarehouses(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load warehouses:', err);
    }
  };

  const handleTransfer = async () => {
    if (!lot) return;
    if (sourceWarehouse === targetWarehouse) {
      setErrorMessage('Source and target warehouses cannot be identical.');
      return;
    }
    if (quantity <= 0 || quantity > lot.availableQuantity) {
      setErrorMessage(`Transfer quantity must be between 1 and ${lot.availableQuantity}.`);
      return;
    }

    setErrorMessage('');
    setSubmitting(true);
    try {
      await apiClient.post('/warehouses/transfer', {
        lotId: lot.id,
        sourceWarehouse,
        targetWarehouse,
        quantity,
        notes
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || err.message || 'Transfer failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (!lot) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Inter-Warehouse Transfer: Lot #${lot.lotNumber}`} maxWidth="550px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {errorMessage && (
          <div style={{ padding: '0.75rem 1rem', backgroundColor: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 'var(--radius-md)', color: '#991b1b', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={16} />
            {errorMessage}
          </div>
        )}

        {/* Lot Item Details Summary */}
        <div style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Transferring Stock Item:</div>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.15rem' }}>
            {lot.itemName} ({lot.availableQuantity} {lot.unit} available)
          </div>
        </div>

        {/* Source & Target Dropdowns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0.75rem', alignItems: 'center' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
              From Source:
            </label>
            <select
              value={sourceWarehouse}
              onChange={(e) => setSourceWarehouse(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', fontSize: '0.85rem' }}
            >
              {warehouses.map((w) => (
                <option key={w._id} value={w.code}>
                  {w.code} - {w.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ paddingTop: '1.25rem', color: 'var(--primary)' }}>
            <ArrowRight size={22} />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
              To Destination:
            </label>
            <select
              value={targetWarehouse}
              onChange={(e) => setTargetWarehouse(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', fontSize: '0.85rem' }}
            >
              {warehouses.map((w) => (
                <option key={w._id} value={w.code}>
                  {w.code} - {w.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Transfer Quantity & Notes */}
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
            Transfer Quantity ({lot.unit}):
          </label>
          <input
            type="number"
            min={1}
            max={lot.availableQuantity}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', fontSize: '0.85rem' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
            Transfer Reason / Transport Manifest Notes:
          </label>
          <textarea
            rows={2}
            value={notes}
            placeholder="e.g. Relocating stock to North Annex to balance regional distribution demand."
            onChange={(e) => setNotes(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', fontSize: '0.85rem' }}
          />
        </div>

        {/* Modal Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-default)' }}>
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="primary" leftIcon={<Truck size={16} />} onClick={handleTransfer} isLoading={submitting}>
            Dispatch Inter-Warehouse Transfer
          </Button>
        </div>
      </div>
    </Modal>
  );
};
