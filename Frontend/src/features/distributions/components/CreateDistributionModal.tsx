import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Send, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { Modal } from '../../../components/common/Modal/Modal';
import { Input } from '../../../components/common/Input/Input';
import { Select } from '../../../components/common/Select/Select';
import { Button } from '../../../components/common/Button/Button';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchRecipients, createDistribution, clearMessages } from '../distributionSlice';

interface CreateDistributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface ItemLineInput {
  itemName: string;
  requestedQuantity: number;
  unit: string;
}

const UNIT_OPTIONS = [
  { value: 'units', label: 'Units / Items' },
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'packets', label: 'Packets' },
  { value: 'boxes', label: 'Boxes' },
  { value: 'cans', label: 'Cans' },
  { value: 'liters', label: 'Liters' }
];

export const CreateDistributionModal: React.FC<CreateDistributionModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const dispatch = useAppDispatch();
  const { recipients, recipientsLoading, actionLoading, error } = useAppSelector(
    (state) => state.distribution
  );

  const [recipientId, setRecipientId] = useState('');
  const [items, setItems] = useState<ItemLineInput[]>([
    { itemName: '', requestedQuantity: 1, unit: 'units' }
  ]);
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchRecipients());
      dispatch(clearMessages());
      setFormError(null);
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (recipients.length > 0 && !recipientId) {
      setRecipientId(recipients[0].id);
    }
  }, [recipients, recipientId]);

  const selectedRecipient = recipients.find((r) => r.id === recipientId);

  const recipientOptions = recipients.map((r) => ({
    value: r.id,
    label: `${r.name} (${r.type === 'family' ? 'Family' : 'Agency'}${r.type === 'family' ? ` • Quota: ${r.monthlyQuota} units/mo` : ''})`
  }));

  const handleAddItem = () => {
    setItems([...items, { itemName: '', requestedQuantity: 10, unit: 'units' }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) {
      setFormError('At least one item request line is required');
      return;
    }
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof ItemLineInput, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const totalRequestedUnits = items.reduce(
    (sum, item) => sum + (Number(item.requestedQuantity) || 0),
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!recipientId) {
      setFormError('Please select a recipient family or agency');
      return;
    }

    if (items.length === 0) {
      setFormError('At least one requested item line is required');
      return;
    }

    for (let i = 0; i < items.length; i++) {
      if (!items[i].itemName.trim()) {
        setFormError(`Item #${i + 1} name is required`);
        return;
      }
      if (!items[i].requestedQuantity || Number(items[i].requestedQuantity) <= 0) {
        setFormError(`Item #${i + 1} quantity must be greater than 0`);
        return;
      }
    }

    const payload = {
      recipientId,
      items: items.map((i) => ({
        itemName: i.itemName.trim(),
        requestedQuantity: Number(i.requestedQuantity),
        unit: i.unit
      })),
      notes: notes.trim() || undefined
    };

    const result = await dispatch(createDistribution(payload));
    if (createDistribution.fulfilled.match(result)) {
      toast.success('Distribution request created successfully!');
      if (onSuccess) onSuccess();
      onClose();
    } else if (createDistribution.rejected.match(result)) {
      toast.error((result.payload as string) || 'Failed to create distribution request');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Distribution Request"
      subtitle="Request food handout items for a registered family or agency partner"
      maxWidth="720px"
    >
      <form noValidate onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {(formError || error) && (
          <div
            style={{
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{formError || error}</span>
          </div>
        )}

        {/* Recipient Selection */}
        <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-main)', margin: 0 }}>
              1. Recipient Details
            </h4>
            {selectedRecipient?.type === 'family' && (
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  backgroundColor: '#e0f2fe',
                  color: '#0369a1',
                  padding: '0.25rem 0.6rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid #bae6fd'
                }}
              >
                Monthly Quota: {selectedRecipient.monthlyQuota} Units
              </span>
            )}
          </div>

          <Select
            label="Select Recipient (Family / Agency) *"
            options={recipientOptions}
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
            disabled={recipientsLoading}
          />

          {selectedRecipient && (
            <div style={{ marginTop: '0.75rem', padding: '0.65rem 0.85rem', backgroundColor: '#ffffff', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-main)' }}>
                <span><strong>Selected:</strong> {selectedRecipient.name}</span>
                <span style={{ textTransform: 'capitalize', fontWeight: 600, color: 'var(--primary)' }}>Type: {selectedRecipient.type}</span>
              </div>
              {selectedRecipient.type === 'family' && (
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  ℹ️ Family requests are strictly validated against the 50-unit monthly quota limit by the backend.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Requested Items */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-main)', margin: 0 }}>
                2. Requested Food Items ({items.length})
              </h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                Total Requested: <strong style={{ color: 'var(--primary)' }}>{totalRequestedUnits} units</strong>
              </p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={handleAddItem} leftIcon={<Plus size={14} />}>
              Add Requested Item
            </Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {items.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr auto',
                  gap: '0.75rem',
                  alignItems: 'end',
                  backgroundColor: '#ffffff',
                  padding: '0.75rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-default)'
                }}
              >
                <Input
                  label={`Item #${idx + 1} Name *`}
                  placeholder="e.g. Rice, Milk, Beans"
                  value={item.itemName}
                  onChange={(e) => handleItemChange(idx, 'itemName', e.target.value)}
                  required
                />
                <Input
                  label="Quantity *"
                  type="number"
                  min="1"
                  value={item.requestedQuantity}
                  onChange={(e) => handleItemChange(idx, 'requestedQuantity', e.target.value)}
                  required
                />
                <Select
                  label="Unit"
                  options={UNIT_OPTIONS}
                  value={item.unit}
                  onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveItem(idx)}
                  style={{
                    padding: '0.55rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: '#fef2f2',
                    color: '#ef4444',
                    border: '1px solid #fecaca',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '2px'
                  }}
                  title="Remove item line"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <Input
          label="Coordinator Notes (Optional)"
          placeholder="e.g. Emergency family assistance request"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {/* Modal Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={actionLoading} leftIcon={<Send size={16} />}>
            Create Distribution Request
          </Button>
        </div>
      </form>
    </Modal>
  );
};
