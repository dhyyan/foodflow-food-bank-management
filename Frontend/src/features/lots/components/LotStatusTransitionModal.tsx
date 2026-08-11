import React, { useState, useEffect } from 'react';
import { CheckCircle2, ShieldAlert, Archive, Trash2, ArrowRight } from 'lucide-react';
import { Modal } from '../../../components/common/Modal/Modal';
import { Button } from '../../../components/common/Button/Button';
import { Select } from '../../../components/common/Select/Select';
import { StatusBadge } from '../../../components/shared/StatusBadge/StatusBadge';
import type { LotItem, LotStatus } from '../lot.types';
import { useLots } from '../hooks/useLots';

interface LotStatusTransitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  lot: LotItem | null;
  defaultTargetStatus?: LotStatus | string;
}

export const LotStatusTransitionModal: React.FC<LotStatusTransitionModalProps> = ({
  isOpen,
  onClose,
  lot,
  defaultTargetStatus
}) => {
  const { performTransition, transitionLoading, error, resetAlerts } = useLots();
  const [targetStatus, setTargetStatus] = useState<LotStatus>('checked');
  const [notes, setNotes] = useState('');

  const getAvailableTargets = (current?: LotStatus): { value: LotStatus; label: string }[] => {
    if (!current) return [];

    switch (current) {
      case 'received':
        return [
          { value: 'checked', label: 'Pass Inspection (checked)' },
          { value: 'quarantined', label: 'Fail Inspection (quarantined)' }
        ];
      case 'checked':
        return [
          { value: 'shelved', label: 'Move to Shelf (shelved)' },
          { value: 'quarantined', label: 'Quarantine Food (quarantined)' },
          { value: 'discarded', label: 'Discard Lot (discarded)' }
        ];
      case 'shelved':
        return [
          { value: 'quarantined', label: 'Quarantine Lot (quarantined)' },
          { value: 'discarded', label: 'Discard Expired/Damaged (discarded)' }
        ];
      case 'quarantined':
        return [
          { value: 'discarded', label: 'Discard Food (discarded)' },
          { value: 'checked', label: 'Re-inspect & Clear (checked)' }
        ];
      default:
        return [];
    }
  };

  const availableOptions = lot ? getAvailableTargets(lot.status) : [];

  useEffect(() => {
    if (isOpen && lot) {
      resetAlerts();
      setNotes('');
      if (defaultTargetStatus && availableOptions.some((opt) => opt.value === defaultTargetStatus)) {
        setTargetStatus(defaultTargetStatus as LotStatus);
      } else if (availableOptions.length > 0) {
        setTargetStatus(availableOptions[0].value);
      }
    }
  }, [isOpen, lot, defaultTargetStatus]);

  if (!lot) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await performTransition(lot.id, {
        targetStatus,
        notes: notes.trim() || `Status updated from ${lot.status} to ${targetStatus}`
      });
      onClose();
    } catch {
      // Error handled by Redux slice state
    }
  };

  const getActionIcon = () => {
    switch (targetStatus) {
      case 'checked':
        return <CheckCircle2 size={18} />;
      case 'shelved':
        return <Archive size={18} />;
      case 'quarantined':
        return <ShieldAlert size={18} />;
      case 'discarded':
        return <Trash2 size={18} />;
      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Transition State — Lot #${lot.lotNumber}`} maxWidth="540px">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* State Banner */}
        <div
          style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-default)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>CURRENT STATE</div>
            <div style={{ marginTop: '0.2rem' }}>
              <StatusBadge status={lot.status} />
            </div>
          </div>

          <ArrowRight size={20} style={{ color: 'var(--text-muted)' }} />

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>TARGET STATE</div>
            <div style={{ marginTop: '0.2rem' }}>
              <StatusBadge status={targetStatus} />
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--red-light)', border: '1px solid var(--red-border)', color: 'var(--accent-red)', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        {/* Target Status Select */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
            Select Next Lifecycle Action *
          </label>
          <Select
            value={targetStatus}
            onChange={(e) => setTargetStatus(e.target.value as LotStatus)}
            options={availableOptions}
          />
        </div>

        {/* Transition Reason / Notes */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
            Inspection Notes / Reason (Optional)
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Provide inspection details, warehouse shelf location, or reason for quarantine/discard..."
            style={{
              width: '100%',
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-default)',
              backgroundColor: '#ffffff',
              fontSize: '0.88rem',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Modal Footer Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-default)' }}>
          <Button type="button" variant="outline" onClick={onClose} disabled={transitionLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant={targetStatus === 'discarded' || targetStatus === 'quarantined' ? 'danger' : 'primary'}
            isLoading={transitionLoading}
            leftIcon={getActionIcon()}
          >
            Confirm Status Update
          </Button>
        </div>
      </form>
    </Modal>
  );
};
