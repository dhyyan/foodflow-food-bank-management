import React, { useEffect } from 'react';
import { User, Clock, ArrowRight, Package, Building } from 'lucide-react';
import { Modal } from '../../../components/common/Modal/Modal';
import { Button } from '../../../components/common/Button/Button';
import { Loader } from '../../../components/common/Loader/Loader';
import { StatusBadge } from '../../../components/shared/StatusBadge/StatusBadge';
import { formatDate } from '../../../utils/date';
import type { LotItem } from '../lot.types';
import { useLots } from '../hooks/useLots';

interface LotTraceModalProps {
  isOpen: boolean;
  onClose: () => void;
  lot: LotItem | null;
}

export const LotTraceModal: React.FC<LotTraceModalProps> = ({ isOpen, onClose, lot }) => {
  const { selectedTrace, traceLoading, loadLotTrace, resetTrace } = useLots();

  useEffect(() => {
    if (isOpen && lot?.id) {
      loadLotTrace(lot.id);
    } else {
      resetTrace();
    }
  }, [isOpen, lot?.id, loadLotTrace, resetTrace]);

  if (!lot) return null;

  const currentLot = selectedTrace?.lot || lot;
  const donation = selectedTrace?.donation;
  const timeline = selectedTrace?.timeline || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Traceability Journey — Lot #${currentLot.lotNumber}`} maxWidth="720px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Top Summary Banner */}
        <div
          style={{
            padding: '1rem 1.25rem',
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
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {currentLot.itemName} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>({currentLot.category})</span>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Initial Qty: <strong>{currentLot.quantity} {currentLot.unit}</strong></span>
              <span>•</span>
              <span>Current Status: <StatusBadge status={currentLot.status} size="sm" /></span>
            </div>
          </div>

          {donation && (
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Building size={13} /> {donation.donorName}
              </span>
              <span>Intake #: {donation.donationNumber}</span>
            </div>
          )}
        </div>

        {/* Visual Workflow Breadcrumb / Progression */}
        <div
          style={{
            padding: '0.85rem 1rem',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            gap: '0.5rem',
            fontSize: '0.78rem',
            fontWeight: 700
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary)' }}>
            <Package size={15} /> Donation Intake
          </div>
          <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: currentLot.status !== 'received' ? 'var(--primary)' : 'var(--accent-amber)' }}>
            Received
          </div>
          <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: ['checked', 'shelved', 'reserved', 'released'].includes(currentLot.status) ? 'var(--primary)' : 'var(--text-muted)' }}>
            Checked
          </div>
          <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: ['shelved', 'reserved', 'released'].includes(currentLot.status) ? 'var(--primary)' : 'var(--text-muted)' }}>
            Shelved
          </div>
          <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: currentLot.status === 'reserved' ? 'var(--accent-blue)' : currentLot.status === 'released' ? 'var(--primary)' : 'var(--text-muted)' }}>
            Reserved
          </div>
          <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: currentLot.status === 'released' ? 'var(--primary)' : currentLot.status === 'quarantined' || currentLot.status === 'discarded' ? 'var(--accent-red)' : 'var(--text-muted)' }}>
            {currentLot.status === 'quarantined' ? 'Quarantined' : currentLot.status === 'discarded' ? 'Discarded' : 'Released'}
          </div>
        </div>

        {/* Audit Event Timeline */}
        {traceLoading ? (
          <div style={{ padding: '2rem 0', display: 'flex', justifyContent: 'center' }}>
            <Loader text="Loading complete lot lifecycle history..." />
          </div>
        ) : (
          <div style={{ position: 'relative', paddingLeft: '1.5rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Timeline Vertical Line */}
            <div
              style={{
                position: 'absolute',
                top: '0.5rem',
                bottom: '0.5rem',
                left: '0.45rem',
                width: '2px',
                backgroundColor: 'var(--border-default)'
              }}
            />

            {timeline.map((evt, idx) => (
              <div
                key={evt.id || idx}
                style={{
                  position: 'relative',
                  backgroundColor: '#ffffff',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-default)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {/* Bullet Node */}
                <div
                  style={{
                    position: 'absolute',
                    left: '-1.35rem',
                    top: '1rem',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: evt.newStatus === 'quarantined' || evt.newStatus === 'discarded' ? 'var(--accent-red)' : 'var(--primary)',
                    border: '2px solid #ffffff'
                  }}
                />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                      {evt.eventType.replace(/_/g, ' ')}
                    </span>
                    <StatusBadge status={evt.newStatus} size="sm" />
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={12} /> {formatDate(evt.timestamp)}
                  </span>
                </div>

                <div style={{ fontSize: '0.82rem', color: 'var(--text-subtle)', marginBottom: '0.25rem' }}>
                  {evt.notes || `Lot transitioned to ${evt.newStatus}`}
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <User size={12} /> Executed by <strong>{evt.performedBy.name}</strong> {evt.performedBy.role && `(${evt.performedBy.role})`}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.75rem', borderTop: '1px solid var(--border-default)' }}>
          <Button variant="outline" onClick={onClose}>
            Close Traceability
          </Button>
        </div>
      </div>
    </Modal>
  );
};
