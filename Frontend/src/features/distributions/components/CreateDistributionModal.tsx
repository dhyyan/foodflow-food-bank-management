import React, { useState } from 'react';
import { Modal } from '../../../components/common/Modal/Modal';
import { Input } from '../../../components/common/Input/Input';
import { Button } from '../../../components/common/Button/Button';
import { Plus, Trash2, Shield, Zap, AlertTriangle, Layers } from 'lucide-react';
import { formatDate } from '../../../utils/date';
import apiClient from '../../../services/api/apiClient';

interface LineItem {
  itemName: string;
  category: string;
  quantityRequested: number;
}

interface AllocatedLot {
  lotId: string;
  lotNumber: string;
  itemName: string;
  category: string;
  allocatedQuantity: number;
  effectiveExpiryDate?: string;
  receivedDate: string;
  allocationReason: string;
}

interface AllocationPreview {
  recipientName: string;
  allocationPolicy: 'FEFO' | 'STRATEGIC_RESERVE';
  totalUnitsAllocated: number;
  allocatedLots: AllocatedLot[];
  unfulfilledItems: { itemName: string; missingQuantity: number }[];
}

interface CreateDistributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateDistributionModal: React.FC<CreateDistributionModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [recipientName, setRecipientName] = useState('');
  const [familyCount, setFamilyCount] = useState<number>(10);
  const [allocationPolicy, setAllocationPolicy] = useState<'FEFO' | 'STRATEGIC_RESERVE'>('FEFO');
  const [items, setItems] = useState<LineItem[]>([
    { itemName: 'Rice', category: 'Grains', quantityRequested: 50 },
    { itemName: 'Canned Goods', category: 'Canned Goods', quantityRequested: 30 }
  ]);

  const [preview, setPreview] = useState<AllocationPreview | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddItem = () => {
    setItems([...items, { itemName: '', category: 'Grains', quantityRequested: 10 }]);
  };

  const handleRemoveItem = (index: number) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
    setPreview(null);
  };

  const handleItemChange = (index: number, field: keyof LineItem, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
    setPreview(null);
  };

  const handleFetchPreview = async () => {
    if (!recipientName.trim()) {
      setErrorMessage('Please enter a recipient organization or family name.');
      return;
    }
    setErrorMessage('');
    setLoadingPreview(true);
    try {
      const res = await apiClient.post('/distributions/preview-allocation', {
        recipientName,
        familyCount,
        items,
        allocationPolicy
      });
      if (res.data && res.data.data) {
        setPreview(res.data.data);
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || err.message || 'Failed to generate allocation preview');
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleSubmitDistribution = async () => {
    if (!recipientName.trim()) {
      setErrorMessage('Please enter a recipient organization or family name.');
      return;
    }
    setErrorMessage('');
    setSubmitting(true);
    try {
      await apiClient.post('/distributions', {
        recipientName,
        familyCount,
        items,
        allocationPolicy
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || err.message || 'Failed to submit distribution order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Distribution Request & FEFO Allocation" maxWidth="750px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {errorMessage && (
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#fee2e2',
              border: '1px solid #fca5a5',
              borderRadius: 'var(--radius-md)',
              color: '#991b1b',
              fontSize: '0.85rem'
            }}
          >
            {errorMessage}
          </div>
        )}

        {/* Recipient & Family Count inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              Recipient Organization / Family Name *
            </label>
            <Input
              placeholder="e.g. St. Jude Shelter or Hope Family Group"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              Families Served
            </label>
            <Input
              type="number"
              value={familyCount}
              onChange={(e) => setFamilyCount(parseInt(e.target.value) || 1)}
            />
          </div>
        </div>

        {/* Strategic Reserve Buffer Toggle Switch */}
        <div
          style={{
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: allocationPolicy === 'STRATEGIC_RESERVE' ? '#eff6ff' : 'var(--bg-subtle)',
            border: allocationPolicy === 'STRATEGIC_RESERVE' ? '1px solid #93c5fd' : '1px solid var(--border-default)',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {allocationPolicy === 'STRATEGIC_RESERVE' ? (
                <Shield size={22} style={{ color: 'var(--accent-blue)' }} />
              ) : (
                <Zap size={22} style={{ color: 'var(--primary)' }} />
              )}
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Allocation Strategy: {allocationPolicy === 'STRATEGIC_RESERVE' ? 'Strategic Reserve Buffer' : 'Standard FEFO'}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                  {allocationPolicy === 'STRATEGIC_RESERVE'
                    ? 'For staple goods (rice, flour, canned goods), allocates most recently received stock first, holding older stock back as emergency buffer.'
                    : 'Standard First-Expired-First-Out: Allocates in-stock items with earliest expiration dates first.'}
                </div>
              </div>
            </div>

            <Button
              variant={allocationPolicy === 'STRATEGIC_RESERVE' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => {
                const next = allocationPolicy === 'FEFO' ? 'STRATEGIC_RESERVE' : 'FEFO';
                setAllocationPolicy(next);
                setPreview(null);
              }}
            >
              Toggle Strategy
            </Button>
          </div>
        </div>

        {/* Requested Line Items Table */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Requested Items List
            </span>
            <Button variant="outline" size="sm" leftIcon={<Plus size={14} />} onClick={handleAddItem}>
              Add Line Item
            </Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {items.map((line, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 40px', gap: '0.5rem', alignItems: 'center' }}>
                <Input
                  placeholder="Item Name (e.g. Rice, Milk)"
                  value={line.itemName}
                  onChange={(e) => handleItemChange(idx, 'itemName', e.target.value)}
                />
                <select
                  value={line.category}
                  onChange={(e) => handleItemChange(idx, 'category', e.target.value)}
                  style={{
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-default)',
                    fontSize: '0.85rem'
                  }}
                >
                  <option value="Grains">Grains (Staple)</option>
                  <option value="Canned Goods">Canned Goods (Staple)</option>
                  <option value="Dry Goods">Dry Goods (Staple)</option>
                  <option value="Produce">Produce</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Protein">Protein</option>
                </select>
                <Input
                  type="number"
                  placeholder="Qty"
                  value={line.quantityRequested}
                  onChange={(e) => handleItemChange(idx, 'quantityRequested', parseFloat(e.target.value) || 0)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveItem(idx)}
                  disabled={items.length <= 1}
                  style={{ padding: '0.5rem', color: 'var(--accent-red)' }}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Live Allocation Preview Section */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button variant="outline" leftIcon={<Layers size={16} />} onClick={handleFetchPreview} isLoading={loadingPreview}>
            Calculate Live FEFO / Buffer Allocation Preview
          </Button>
        </div>

        {/* Allocation Preview Table Results */}
        {preview && (
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-default)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Allocated Lots Preview ({preview.totalUnitsAllocated} Units Total)
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.5rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: preview.allocationPolicy === 'STRATEGIC_RESERVE' ? '#dbeafe' : 'var(--primary-light)',
                  color: preview.allocationPolicy === 'STRATEGIC_RESERVE' ? '#1e40af' : 'var(--primary)'
                }}
              >
                Policy: {preview.allocationPolicy}
              </span>
            </div>

            {preview.unfulfilledItems.length > 0 && (
              <div style={{ padding: '0.5rem 0.75rem', backgroundColor: '#fffbebf', border: '1px solid #fde68a', borderRadius: 'var(--radius-sm)', marginBottom: '0.75rem', fontSize: '0.8rem', color: '#92400e', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={15} />
                Unfulfilled stock deficit: {preview.unfulfilledItems.map(u => `${u.missingQuantity} ${u.itemName}`).join(', ')}
              </div>
            )}

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
              <thead style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-default)' }}>
                <tr>
                  <th style={{ padding: '0.5rem 0.75rem' }}>Lot #</th>
                  <th style={{ padding: '0.5rem 0.75rem' }}>Item</th>
                  <th style={{ padding: '0.5rem 0.75rem' }}>Allocated Qty</th>
                  <th style={{ padding: '0.5rem 0.75rem' }}>Expiry Date</th>
                  <th style={{ padding: '0.5rem 0.75rem' }}>Allocation Priority Rule</th>
                </tr>
              </thead>
              <tbody>
                {preview.allocatedLots.map((alloc, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '0.5rem 0.75rem', fontWeight: 700 }}>#{alloc.lotNumber}</td>
                    <td style={{ padding: '0.5rem 0.75rem' }}>{alloc.itemName}</td>
                    <td style={{ padding: '0.5rem 0.75rem', fontWeight: 800, color: 'var(--primary)' }}>{alloc.allocatedQuantity}</td>
                    <td style={{ padding: '0.5rem 0.75rem' }}>{alloc.effectiveExpiryDate ? formatDate(alloc.effectiveExpiryDate) : '-'}</td>
                    <td style={{ padding: '0.5rem 0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{alloc.allocationReason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-default)' }}>
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmitDistribution} isLoading={submitting}>
            Confirm & Reserve Distribution
          </Button>
        </div>
      </div>
    </Modal>
  );
};
