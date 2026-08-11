import React from 'react';
import { Layers, CheckCircle } from 'lucide-react';
import { Modal } from '../../../components/common/Modal/Modal';
import { Button } from '../../../components/common/Button/Button';
import { StatusBadge } from '../../../components/shared/StatusBadge/StatusBadge';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { completeDistribution } from '../distributionSlice';
import type { DistributionRecord } from '../distribution.types';
import { formatDate } from '../../../utils/date';

interface DistributionDetailsModalProps {
  distribution: DistributionRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const DistributionDetailsModal: React.FC<DistributionDetailsModalProps> = ({
  distribution,
  isOpen,
  onClose,
  onSuccess
}) => {
  const dispatch = useAppDispatch();
  const { actionLoading, error } = useAppSelector((state) => state.distribution);

  if (!distribution) return null;

  const handleComplete = async () => {
    const result = await dispatch(completeDistribution(distribution.id));
    if (completeDistribution.fulfilled.match(result)) {
      if (onSuccess) onSuccess();
    }
  };

  const totalReservedUnits = distribution.reservations
    ? distribution.reservations.reduce((sum, r) => sum + r.quantity, 0)
    : 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Distribution #${distribution.distributionNumber}`}
      subtitle="Complete traceability report: recipient details, requested items, and reserved lots breakdown"
      maxWidth="780px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {error && (
          <div
            style={{
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              fontSize: '0.85rem'
            }}
          >
            {error}
          </div>
        )}

        {/* Overview Header Card */}
        <div
          style={{
            backgroundColor: 'var(--bg-subtle)',
            padding: '1.1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-light)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '1rem'
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
              Recipient Identity
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>
              {distribution.recipientName}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'capitalize' }}>
              Type: {distribution.recipientType}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
              Handout Coordinator
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.2rem' }}>
              {distribution.createdBy.name}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Created: {formatDate(distribution.createdAt)}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700, marginBottom: '0.3rem' }}>
              Current Status
            </div>
            <StatusBadge status={distribution.status} />
          </div>
        </div>

        {/* Section 1: Requested Items */}
        <div style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
          <h4 style={{ fontSize: '0.88rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
            1. Requested Items Summary
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {distribution.items.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.6rem 0.85rem',
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.88rem'
                }}
              >
                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{item.itemName}</span>
                <span style={{ fontWeight: 800, color: 'var(--primary)' }}>
                  {item.requestedQuantity} {item.unit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Actually Reserved Lots (Traceability Requirement) */}
        <div style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-main)', margin: 0 }}>
              2. Actually Reserved Inventory Lots (Traceability Breakdown)
            </h4>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              Reserved Total: <strong style={{ color: 'var(--primary)' }}>{totalReservedUnits} units</strong>
            </span>
          </div>

          {!distribution.reservations || distribution.reservations.length === 0 ? (
            <div style={{ padding: '1.25rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
              No inventory reservations confirmed yet for this request. Trigger FEFO Preview & Confirm Reservation to reserve stock.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {distribution.reservations.map((res, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem 0.9rem',
                    backgroundColor: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)',
                    fontSize: '0.85rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Layers size={16} style={{ color: 'var(--primary)' }} />
                    <div>
                      <div style={{ fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
                        Lot #{res.lotNumber}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Item: {res.itemName} | Reserved by {res.createdBy.name}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.95rem' }}>
                      {res.quantity} {res.unit}
                    </div>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: res.status === 'released' ? '#15803d' : '#0369a1'
                      }}
                    >
                      Status: {res.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>

          {distribution.status === 'reserved' && (
            <Button
              type="button"
              variant="primary"
              isLoading={actionLoading}
              onClick={handleComplete}
              leftIcon={<CheckCircle size={16} />}
            >
              Complete Distribution & Handout Food
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
