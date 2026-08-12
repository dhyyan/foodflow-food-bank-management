import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Send, AlertCircle, Search, UserPlus, CheckCircle2, ShieldAlert } from 'lucide-react';
import { toast } from 'react-toastify';
import { Modal } from '../../../components/common/Modal/Modal';
import { Input } from '../../../components/common/Input/Input';
import { Select } from '../../../components/common/Select/Select';
import { Button } from '../../../components/common/Button/Button';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  fetchRecipients,
  checkRecipientQuota,
  createRecipient,
  createDistribution,
  clearMessages,
  clearCheckedQuota
} from '../distributionSlice';
import type { RecipientType } from '../distribution.types';

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
  const { recipients, recipientsLoading, checkedQuota, quotaLoading, actionLoading, error } = useAppSelector(
    (state) => state.distribution
  );

  const [recipientId, setRecipientId] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [isRegisteringNew, setIsRegisteringNew] = useState(false);

  // New recipient form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newContactPerson, setNewContactPerson] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newType, setNewType] = useState<RecipientType>('family');
  const [newMonthlyQuota, setNewMonthlyQuota] = useState<number>(50);

  const [items, setItems] = useState<ItemLineInput[]>([
    { itemName: '', requestedQuantity: 1, unit: 'units' }
  ]);
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchRecipients(undefined));
      dispatch(clearMessages());
      dispatch(clearCheckedQuota());
      setFormError(null);
      setIsRegisteringNew(false);
      setSearchEmail('');
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (recipients.length > 0 && !recipientId) {
      const first = recipients[0];
      setRecipientId(first.id);
      if (first.contactEmail) {
        setSearchEmail(first.contactEmail);
      }
      dispatch(checkRecipientQuota(first.id));
    }
  }, [recipients, recipientId, dispatch]);

  const selectedRecipient = recipients.find((r) => r.id === recipientId);

  const recipientOptions = recipients.map((r) => ({
    value: r.id,
    label: `${r.name} (${r.type === 'family' ? 'Family' : 'Agency'}${r.contactEmail ? ` • ${r.contactEmail}` : ''})`
  }));

  const handleSelectRecipient = (id: string) => {
    setRecipientId(id);
    const rec = recipients.find((r) => r.id === id);
    if (rec) {
      if (rec.contactEmail) {
        setSearchEmail(rec.contactEmail);
      }
      dispatch(checkRecipientQuota(id));
    }
  };

  const handleCheckEmailQuota = () => {
    if (!searchEmail.trim()) {
      setFormError('Please enter an email address or recipient ID to check quota');
      return;
    }
    setFormError(null);
    dispatch(checkRecipientQuota(searchEmail.trim())).then((res) => {
      if (checkRecipientQuota.fulfilled.match(res)) {
        if (res.payload.exists && res.payload.recipient) {
          setRecipientId(res.payload.recipient.id);
          setIsRegisteringNew(false);
        } else {
          setIsRegisteringNew(true);
          setNewEmail(searchEmail.trim());
          setNewName('');
        }
      }
    });
  };

  const handleSaveNewRecipient = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!newName.trim()) {
      setFormError('Recipient / Family name is required');
      return;
    }
    if (!newEmail.trim()) {
      setFormError('Contact email is required');
      return;
    }

    const payload = {
      name: newName.trim(),
      contactEmail: newEmail.trim(),
      type: newType,
      contactPerson: newContactPerson.trim() || undefined,
      address: newAddress.trim() || undefined,
      monthlyQuota: Number(newMonthlyQuota) || 50
    };

    const res = await dispatch(createRecipient(payload));
    if (createRecipient.fulfilled.match(res)) {
      toast.success(`Family '${res.payload.name}' saved to database successfully!`);
      setRecipientId(res.payload.id);
      setSearchEmail(res.payload.contactEmail || '');
      setIsRegisteringNew(false);
      dispatch(checkRecipientQuota(res.payload.id));
    } else if (createRecipient.rejected.match(res)) {
      setFormError((res.payload as string) || 'Failed to save recipient to database');
    }
  };

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

  const isFamily = checkedQuota?.recipient?.type === 'family' || selectedRecipient?.type === 'family';
  const monthlyQuota = checkedQuota ? checkedQuota.monthlyQuota : selectedRecipient?.monthlyQuota || 50;
  const usedThisMonth = checkedQuota ? checkedQuota.usedThisMonth : 0;
  const remainingQuota = checkedQuota ? checkedQuota.remainingQuota : 50;

  const isQuotaAlreadyCompleted = isFamily && checkedQuota?.isQuotaCompleted;
  const isRequestExceedingRemaining = isFamily && checkedQuota && totalRequestedUnits > remainingQuota;
  const isQuotaExceeded = isFamily && checkedQuota && (isQuotaAlreadyCompleted || isRequestExceedingRemaining);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!recipientId) {
      setFormError('Please select or register a recipient family or agency');
      return;
    }

    if (isFamily && isQuotaAlreadyCompleted) {
      setFormError(`This family has already completed their monthly ${monthlyQuota}-unit quota. Request cannot be submitted.`);
      return;
    }

    if (isFamily && isRequestExceedingRemaining) {
      setFormError(
        `Requested total (${totalRequestedUnits} units) exceeds remaining monthly quota (${remainingQuota} units remaining out of ${monthlyQuota}).`
      );
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
      title="Create Handout / Distribution Request"
      subtitle="Verify family email & monthly quota, or dynamically add a new family to the database"
      maxWidth="760px"
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

        {/* Step 1: Recipient Lookup & Quota Check */}
        <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-main)', margin: 0 }}>
              1. Verify Recipient Email & Monthly Quota
            </h4>
            <button
              type="button"
              onClick={() => setIsRegisteringNew(!isRegisteringNew)}
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--primary)',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <UserPlus size={14} />
              {isRegisteringNew ? 'Select Existing Recipient' : '+ Register New Family'}
            </button>
          </div>

          {!isRegisteringNew ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <Select
                  label="Select Existing Recipient *"
                  options={recipientOptions}
                  value={recipientId}
                  onChange={(e) => handleSelectRecipient(e.target.value)}
                  disabled={recipientsLoading}
                />
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                    Or Enter Contact Email *
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Input
                      placeholder="e.g. family@example.com"
                      value={searchEmail}
                      onChange={(e) => setSearchEmail(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleCheckEmailQuota();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="md"
                      onClick={handleCheckEmailQuota}
                      isLoading={quotaLoading}
                      leftIcon={<Search size={14} />}
                    >
                      Verify
                    </Button>
                  </div>
                </div>
              </div>

              {/* Live Quota Status Card */}
              {checkedQuota && (
                <div
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isQuotaExceeded ? '#fff1f2' : '#f0fdf4',
                    border: `1px solid ${isQuotaExceeded ? '#fecdd3' : '#bbf7d0'}`,
                    fontSize: '0.85rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {isQuotaExceeded ? (
                        <ShieldAlert size={18} style={{ color: '#e11d48' }} />
                      ) : (
                        <CheckCircle2 size={18} style={{ color: '#16a34a' }} />
                      )}
                      <strong style={{ color: isQuotaExceeded ? '#9f1239' : '#14532d' }}>
                        {checkedQuota.recipient?.name} ({checkedQuota.recipient?.type === 'family' ? 'Family' : 'Agency'})
                      </strong>
                    </div>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        backgroundColor: isQuotaExceeded ? '#ffe4e6' : '#dcfce7',
                        color: isQuotaExceeded ? '#be123c' : '#15803d',
                        padding: '0.2rem 0.55rem',
                        borderRadius: 'var(--radius-full)'
                      }}
                    >
                      {isQuotaAlreadyCompleted
                        ? 'Quota Completed (50/50)'
                        : isRequestExceedingRemaining
                        ? 'Exceeds Remaining Quota'
                        : 'Quota Available'}
                    </span>
                  </div>

                  {checkedQuota.recipient?.type === 'family' ? (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                        <span>Used this month: <strong>{usedThisMonth} / {monthlyQuota} units</strong></span>
                        <span>Remaining available: <strong style={{ color: remainingQuota > 0 ? '#16a34a' : '#dc2626' }}>{remainingQuota} units</strong></span>
                      </div>

                      {/* Quota Progress Bar */}
                      <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${Math.min(100, (usedThisMonth / monthlyQuota) * 100)}%`,
                            height: '100%',
                            backgroundColor: isQuotaAlreadyCompleted ? '#ef4444' : usedThisMonth > 35 ? '#f59e0b' : '#22c55e',
                            transition: 'width 0.3s ease'
                          }}
                        />
                      </div>

                      {isQuotaAlreadyCompleted && (
                        <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.78rem', color: '#be123c', fontWeight: 600 }}>
                          ⛔ This family has reached their {monthlyQuota}-unit monthly quota limit for this calendar month. No further handouts can be issued.
                        </p>
                      )}

                      {isRequestExceedingRemaining && !isQuotaAlreadyCompleted && (
                        <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.78rem', color: '#be123c', fontWeight: 600 }}>
                          ⚠️ Current request total ({totalRequestedUnits} units) exceeds remaining monthly quota ({remainingQuota} units). Please reduce requested quantities.
                        </p>
                      )}
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Partner agencies do not have a 50-unit monthly family cap.
                    </div>
                  )}
                </div>
              )}

              {/* Not Found Alert */}
              {checkedQuota && !checkedQuota.exists && (
                <div style={{ padding: '0.75rem 0.85rem', backgroundColor: '#fffbebfb', border: '1px solid #fef3c7', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: '#92400e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>⚠️ No registered family or agency found for '<strong>{searchEmail}</strong>'.</span>
                  <Button type="button" variant="primary" size="sm" onClick={() => { setIsRegisteringNew(true); setNewEmail(searchEmail); }}>
                    Register Family to DB
                  </Button>
                </div>
              )}
            </div>
          ) : (
            /* Dynamic Family Registration Form */
            <div style={{ padding: '0.85rem', backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h5 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
                  🆕 Add & Persist New Family to Database
                </h5>
                <button
                  type="button"
                  onClick={() => setIsRegisteringNew(false)}
                  style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Cancel Registration
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <Input
                  label="Family / Recipient Name *"
                  placeholder="e.g. John Doe Family"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                />
                <Input
                  label="Contact Email *"
                  placeholder="e.g. family@example.com"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                />
                <Input
                  label="Contact Person"
                  placeholder="e.g. Jane Doe"
                  value={newContactPerson}
                  onChange={(e) => setNewContactPerson(e.target.value)}
                />
                <Input
                  label="Address"
                  placeholder="e.g. 123 Main St, Sector 4"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                />
                <Select
                  label="Recipient Type"
                  options={[
                    { value: 'family', label: 'Family (50 units/mo quota)' },
                    { value: 'agency', label: 'Agency (No quota limit)' }
                  ]}
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as RecipientType)}
                />
                <Input
                  label="Monthly Quota (Units)"
                  type="number"
                  min="0"
                  value={newMonthlyQuota}
                  onChange={(e) => setNewMonthlyQuota(Number(e.target.value))}
                  disabled={newType === 'agency'}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <Button type="button" variant="primary" size="sm" onClick={handleSaveNewRecipient} isLoading={actionLoading} leftIcon={<UserPlus size={14} />}>
                  Save Family to Database
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Requested Items */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-main)', margin: 0 }}>
                2. Requested Food Items ({items.length})
              </h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                Total Requested: <strong style={{ color: isQuotaExceeded ? '#dc2626' : 'var(--primary)' }}>{totalRequestedUnits} units</strong>
                {isFamily && checkedQuota && (
                  <span> (Available Quota: {remainingQuota} units)</span>
                )}
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
          <Button
            type="submit"
            variant="primary"
            isLoading={actionLoading}
            disabled={Boolean(isQuotaExceeded)}
            leftIcon={<Send size={16} />}
          >
            Create Distribution Request
          </Button>
        </div>
      </form>
    </Modal>
  );
};
