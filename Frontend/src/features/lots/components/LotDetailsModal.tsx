import React from 'react';
import { Calendar, Package, AlertTriangle, ShieldCheck, User, GitCommit, Tag } from 'lucide-react';
import { Modal } from '../../../components/common/Modal/Modal';
import { Button } from '../../../components/common/Button/Button';
import { StatusBadge } from '../../../components/shared/StatusBadge/StatusBadge';
import { formatDate, getDaysUntilExpiry } from '../../../utils/date';
import type { LotItem } from '../lot.types';

interface LotDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lot: LotItem | null;
  onOpenTransitionModal?: (lot: LotItem, defaultTarget?: string) => void;
  onOpenTraceModal?: (lot: LotItem) => void;
}

export const LotDetailsModal: React.FC<LotDetailsModalProps> = ({
  isOpen,
  onClose,
  lot,
  onOpenTransitionModal,
  onOpenTraceModal
}) => {
  if (!lot) return null;

  const daysLeft = lot.effectiveExpiryDate ? getDaysUntilExpiry(lot.effectiveExpiryDate) : null;
  const isExpired = daysLeft !== null && daysLeft <= 0;
  const isExpiringSoon = daysLeft !== null && daysLeft > 0 && daysLeft <= 3;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Lot Details #${lot.lotNumber}`} maxWidth="720px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Header Summary Box */}
        <div
          style={{
            padding: '1.25rem',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Inventory Lot Reference
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
              {lot.lotNumber}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem' }}>
              <StatusBadge status={lot.status} />
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Tag size={13} /> {lot.category}
              </span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Available / Total Stock</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
              {lot.availableQuantity} / {lot.quantity} <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>{lot.unit}</span>
            </div>
          </div>
        </div>

        {/* Expiry Alert Box if expired or expiring soon */}
        {isExpired && (
          <div style={{ padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--red-light)', border: '1px solid var(--red-border)', color: 'var(--accent-red)', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', fontWeight: 600 }}>
            <AlertTriangle size={18} />
            <div>
              <strong>SAFETY BOUNDARY REACHED (EXPIRED):</strong> Effective safety expiry was on {formatDate(lot.effectiveExpiryDate!)}. This lot is ineligible for distribution and must be discarded.
            </div>
          </div>
        )}

        {isExpiringSoon && (
          <div style={{ padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--amber-light)', border: '1px solid var(--amber-border)', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', fontWeight: 600 }}>
            <AlertTriangle size={18} />
            <div>
              <strong>EXPIRING SOON:</strong> Effective safety expiry in {daysLeft} day(s) ({formatDate(lot.effectiveExpiryDate!)}). FEFO priority allocation applies.
            </div>
          </div>
        )}

        {/* Detail Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {/* Food Item */}
          <div className="card" style={{ padding: '0.9rem 1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Package size={14} /> Item Name
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, marginTop: '0.25rem', color: 'var(--text-main)' }}>
              {lot.itemName}
            </div>
          </div>

          {/* Donation Source */}
          <div className="card" style={{ padding: '0.9rem 1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <User size={14} /> Donation Source
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '0.25rem', color: 'var(--text-main)' }}>
              {lot.donorName || 'Direct Intake'}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {lot.donorType || 'Organization'}
            </div>
          </div>

          {/* Received Date */}
          <div className="card" style={{ padding: '0.9rem 1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={14} /> Received Date
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '0.25rem', color: 'var(--text-main)' }}>
              {formatDate(lot.receivedDate)}
            </div>
          </div>

          {/* Printed & Effective Expiry */}
          <div className="card" style={{ padding: '0.9rem 1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <ShieldCheck size={14} /> Printed / Effective Expiry
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '0.25rem', color: 'var(--text-main)' }}>
              {lot.printedExpiryDate ? formatDate(lot.printedExpiryDate) : 'N/A'}
            </div>
            <div style={{ fontSize: '0.78rem', color: isExpired ? 'var(--accent-red)' : 'var(--text-muted)', fontWeight: 600 }}>
              Effective (-{lot.safetyMarginDays}d): {lot.effectiveExpiryDate ? formatDate(lot.effectiveExpiryDate) : 'N/A'}
            </div>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--border-default)' }}>
          <Button
            variant="outline"
            leftIcon={<GitCommit size={15} />}
            onClick={() => {
              onClose();
              if (onOpenTraceModal) onOpenTraceModal(lot);
            }}
          >
            View Traceability History
          </Button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {lot.status === 'received' && onOpenTransitionModal && (
              <>
                <Button variant="danger" size="sm" onClick={() => { onClose(); onOpenTransitionModal(lot, 'quarantined'); }}>
                  Fail Inspection
                </Button>
                <Button variant="primary" size="sm" onClick={() => { onClose(); onOpenTransitionModal(lot, 'checked'); }}>
                  Pass Physical Inspection
                </Button>
              </>
            )}

            {lot.status === 'checked' && onOpenTransitionModal && (
              <>
                <Button variant="secondary" size="sm" onClick={() => { onClose(); onOpenTransitionModal(lot, 'quarantined'); }}>
                  Quarantine
                </Button>
                <Button variant="primary" size="sm" onClick={() => { onClose(); onOpenTransitionModal(lot, 'shelved'); }}>
                  Move to Shelf
                </Button>
              </>
            )}

            {lot.status === 'shelved' && onOpenTransitionModal && (
              <>
                <Button variant="secondary" size="sm" onClick={() => { onClose(); onOpenTransitionModal(lot, 'quarantined'); }}>
                  Flag & Quarantine
                </Button>
                <Button variant="danger" size="sm" onClick={() => { onClose(); onOpenTransitionModal(lot, 'discarded'); }}>
                  Discard Lot
                </Button>
              </>
            )}

            {lot.status === 'quarantined' && onOpenTransitionModal && (
              <Button variant="danger" size="sm" onClick={() => { onClose(); onOpenTransitionModal(lot, 'discarded'); }}>
                Discard Food
              </Button>
            )}

            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
