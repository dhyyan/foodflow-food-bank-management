import React, { useState } from 'react';
import { Plus, Trash2, Box, Calendar, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { Modal } from '../../../components/common/Modal/Modal';
import { Input } from '../../../components/common/Input/Input';
import { Select } from '../../../components/common/Select/Select';
import { Button } from '../../../components/common/Button/Button';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { createDonation, resetCreateSuccess } from '../donationSlice';
import type { DonationLineItemInput } from '../donation.types';
import { formatDate } from '../../../utils/date';

interface CreateDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const DONOR_TYPE_OPTIONS = [
  { value: 'Supermarket', label: 'Supermarket / Retailer' },
  { value: 'Restaurant', label: 'Restaurant / Catering' },
  { value: 'Individual', label: 'Individual Donor' },
  { value: 'Corporate', label: 'Corporate Sponsor' },
  { value: 'Agricultural Farm', label: 'Farm / Local Agriculture' },
  { value: 'Bakery', label: 'Bakery / Food Producer' },
  { value: 'Other', label: 'Other Organization' }
];

const CATEGORY_OPTIONS = [
  { value: 'Grains', label: 'Grains & Cereals' },
  { value: 'Dairy', label: 'Dairy & Refrigerated' },
  { value: 'Produce', label: 'Fresh Produce' },
  { value: 'Canned Goods', label: 'Canned Goods' },
  { value: 'Bakery', label: 'Bakery Items' },
  { value: 'Protein', label: 'Meat & Protein' },
  { value: 'Beverages', label: 'Beverages' },
  { value: 'Snacks', label: 'Snacks & Dry Packets' },
  { value: 'Other', label: 'General / Other' }
];

const UNIT_OPTIONS = [
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'g', label: 'Grams (g)' },
  { value: 'packets', label: 'Packets' },
  { value: 'cans', label: 'Cans' },
  { value: 'boxes', label: 'Boxes' },
  { value: 'liters', label: 'Liters' },
  { value: 'units', label: 'Units / Items' },
  { value: 'bags', label: 'Bags' },
  { value: 'cartons', label: 'Cartons' }
];

const initialLine: DonationLineItemInput = {
  itemName: '',
  category: 'Grains',
  quantity: 10,
  unit: 'kg',
  printedExpiryDate: '',
  safetyMarginDays: 3,
  notes: ''
};

export const CreateDonationModal: React.FC<CreateDonationModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const dispatch = useAppDispatch();
  const { creating, error } = useAppSelector((state) => state.donations);

  const [donorName, setDonorName] = useState('');
  const [donorType, setDonorType] = useState('Supermarket');
  const [receivedAt, setReceivedAt] = useState(() => new Date().toISOString().slice(0, 16));
  const [notes, setNotes] = useState('');
  const [lines, setLines] = useState<DonationLineItemInput[]>([
    { ...initialLine, itemName: '', quantity: 1 }
  ]);
  const [formError, setFormError] = useState<string | null>(null);

  const handleAddLine = () => {
    setLines([...lines, { ...initialLine }]);
  };

  const handleRemoveLine = (index: number) => {
    if (lines.length <= 1) {
      setFormError('Donation must contain at least one line item');
      return;
    }
    setLines(lines.filter((_, i) => i !== index));
  };

  const handleLineChange = (index: number, field: keyof DonationLineItemInput, value: any) => {
    const updated = [...lines];
    updated[index] = { ...updated[index], [field]: value };
    setLines(updated);
  };

  const calculateEffectiveDate = (printedDateStr?: string, margin: number = 3) => {
    if (!printedDateStr) return null;
    const date = new Date(printedDateStr);
    if (isNaN(date.getTime())) return null;
    date.setDate(date.getDate() - margin);
    return date.toISOString().split('T')[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!donorName.trim()) {
      setFormError('Donor Name is required');
      return;
    }

    if (lines.length === 0) {
      setFormError('At least one donated line item is required');
      return;
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line.itemName.trim()) {
        setFormError(`Item #${i + 1} name is required`);
        return;
      }
      if (!line.quantity || line.quantity <= 0) {
        setFormError(`Item '${line.itemName}' must have a quantity greater than zero`);
        return;
      }
    }

    const payload = {
      donorName: donorName.trim(),
      donorType,
      receivedAt,
      notes: notes.trim(),
      lines: lines.map((l) => ({
        ...l,
        itemName: l.itemName.trim(),
        quantity: Number(l.quantity),
        printedExpiryDate: l.printedExpiryDate ? new Date(l.printedExpiryDate).toISOString() : undefined
      }))
    };

    const result = await dispatch(createDonation(payload));
    if (createDonation.fulfilled.match(result)) {
      toast.success(`Donation intake submitted successfully with ${lines.length} inventory lot(s)!`);
      dispatch(resetCreateSuccess());
      if (onSuccess) onSuccess();
      onClose();
    } else if (createDonation.rejected.match(result)) {
      toast.error((result.payload as string) || 'Failed to submit donation intake');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="New Donation Intake"
      subtitle="Record incoming food donation and automatically generate initial Inventory Lots"
      maxWidth="840px"
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
            <AlertCircle size={16} />
            <span>{formError || error}</span>
          </div>
        )}

        {/* Section 1: Donor Info */}
        <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
          <h4 style={{ fontSize: '0.88rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
            1. Donor & Intake Details
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input
              label="Donor Name / Organization *"
              placeholder="e.g. ABC Supermarket"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              required
            />
            <Select
              label="Donor Type *"
              options={DONOR_TYPE_OPTIONS}
              value={donorType}
              onChange={(e) => setDonorType(e.target.value)}
            />
            <Input
              label="Received Date & Time *"
              type="datetime-local"
              value={receivedAt}
              onChange={(e) => setReceivedAt(e.target.value)}
              leftIcon={<Calendar size={15} />}
              required
            />
            <Input
              label="Intake Notes (Optional)"
              placeholder="e.g. Delivered via refrigerated truck"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Section 2: Donated Line Items */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-main)', margin: 0 }}>
                2. Donated Line Items ({lines.length})
              </h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                Each item line will automatically generate a Lot with status <strong style={{ color: 'var(--primary)' }}>received</strong>
              </p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={handleAddLine} leftIcon={<Plus size={14} />}>
              Add Line Item
            </Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {lines.map((line, idx) => {
              const effectiveDateStr = calculateEffectiveDate(line.printedExpiryDate, line.safetyMarginDays);

              return (
                <div
                  key={idx}
                  style={{
                    padding: '0.9rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-default)',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr auto', gap: '0.75rem', alignItems: 'end' }}>
                    <Input
                      label={`Item #${idx + 1} Name *`}
                      placeholder="e.g. Rice 50kg"
                      value={line.itemName}
                      onChange={(e) => handleLineChange(idx, 'itemName', e.target.value)}
                      required
                    />
                    <Select
                      label="Category"
                      options={CATEGORY_OPTIONS}
                      value={line.category}
                      onChange={(e) => handleLineChange(idx, 'category', e.target.value)}
                    />
                    <Input
                      label="Quantity *"
                      type="number"
                      min="1"
                      value={line.quantity}
                      onChange={(e) => handleLineChange(idx, 'quantity', e.target.value)}
                      required
                    />
                    <Select
                      label="Unit *"
                      options={UNIT_OPTIONS}
                      value={line.unit}
                      onChange={(e) => handleLineChange(idx, 'unit', e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveLine(idx)}
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
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', paddingTop: '0.25rem', borderTop: '1px dashed var(--border-light)' }}>
                    <div>
                      <Input
                        label="Printed Package Expiry Date"
                        type="date"
                        value={line.printedExpiryDate || ''}
                        onChange={(e) => handleLineChange(idx, 'printedExpiryDate', e.target.value)}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', paddingTop: '1.4rem' }}>
                      {effectiveDateStr ? (
                        <div style={{ backgroundColor: 'var(--primary-light)', padding: '0.35rem 0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--primary-border)', width: '100%' }}>
                          <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Effective Expiry (Calculated): </span>
                          <strong style={{ color: 'var(--primary)', fontWeight: 700 }}>{formatDate(effectiveDateStr)}</strong>
                          <span style={{ fontSize: '0.72rem', display: 'block', color: 'var(--text-muted)' }}>(3-day safety margin applied)</span>
                        </div>
                      ) : (
                        <span style={{ fontStyle: 'italic' }}>No printed expiry date specified</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={creating} leftIcon={<Box size={16} />}>
            Submit Intake & Generate Lots
          </Button>
        </div>
      </form>
    </Modal>
  );
};
