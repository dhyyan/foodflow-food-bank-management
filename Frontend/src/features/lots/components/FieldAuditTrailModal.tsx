import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/common/Modal/Modal';
import { Button } from '../../../components/common/Button/Button';
import { History, FileText, RefreshCw } from 'lucide-react';
import { formatDate } from '../../../utils/date';
import apiClient from '../../../services/api/apiClient';

interface FieldDiff {
  _id: string;
  fieldName: string;
  oldValue: string;
  newValue: string;
  changedBy: {
    name: string;
    role?: string;
  };
  notes?: string;
  timestamp: string;
}

interface StatusEvent {
  _id: string;
  eventType: string;
  previousStatus: string;
  newStatus: string;
  performedBy: {
    name: string;
    role?: string;
  };
  notes?: string;
  timestamp: string;
}

interface FieldAuditTrailModalProps {
  isOpen: boolean;
  onClose: () => void;
  lot: {
    id: string;
    lotNumber: string;
    itemName: string;
  } | null;
}

export const FieldAuditTrailModal: React.FC<FieldAuditTrailModalProps> = ({
  isOpen,
  onClose,
  lot
}) => {
  const [fieldDiffs, setFieldDiffs] = useState<FieldDiff[]>([]);
  const [statusEvents, setStatusEvents] = useState<StatusEvent[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    if (!lot) return;
    setLoading(true);
    try {
      const res = await apiClient.get(`/audit/field-history/${lot.id}`);
      if (res.data && res.data.data) {
        setFieldDiffs(res.data.data.fieldDiffs || []);
        setStatusEvents(res.data.data.statusEvents || []);
      }
    } catch (err) {
      console.error('Failed to load audit history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && lot) {
      fetchHistory();
    }
  }, [isOpen, lot]);

  if (!lot) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Full Field-Level Audit Trail: Lot #${lot.lotNumber}`} maxWidth="750px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Header Summary */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Auditing Item:</span>
            <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', marginLeft: '0.4rem' }}>{lot.itemName}</span>
          </div>
          <Button variant="outline" size="sm" leftIcon={<RefreshCw size={14} />} onClick={fetchHistory} isLoading={loading}>
            Refresh Audit Logs
          </Button>
        </div>

        {/* Field Change Diffs (Who/When/Old/New) */}
        <div>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <History size={16} style={{ color: 'var(--primary)' }} />
            Field-Level Change History (Who / When / Old Value / New Value)
          </h4>

          <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
              <thead style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-default)' }}>
                <tr>
                  <th style={{ padding: '0.5rem 0.75rem' }}>Field</th>
                  <th style={{ padding: '0.5rem 0.75rem' }}>Old Value</th>
                  <th style={{ padding: '0.5rem 0.75rem' }}>New Value</th>
                  <th style={{ padding: '0.5rem 0.75rem' }}>Changed By</th>
                  <th style={{ padding: '0.5rem 0.75rem' }}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {fieldDiffs.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No direct field modifications recorded yet for this lot.
                    </td>
                  </tr>
                ) : (
                  fieldDiffs.map((diff) => (
                    <tr key={diff._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '0.5rem 0.75rem', fontWeight: 700, color: 'var(--primary)' }}>{diff.fieldName}</td>
                      <td style={{ padding: '0.5rem 0.75rem', color: '#991b1b', textDecoration: 'line-through' }}>{diff.oldValue}</td>
                      <td style={{ padding: '0.5rem 0.75rem', fontWeight: 700, color: '#065f46' }}>{diff.newValue}</td>
                      <td style={{ padding: '0.5rem 0.75rem' }}>
                        <div style={{ fontWeight: 600 }}>{diff.changedBy.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{diff.changedBy.role || 'Staff'}</div>
                      </td>
                      <td style={{ padding: '0.5rem 0.75rem', color: 'var(--text-muted)' }}>{formatDate(diff.timestamp)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* State Transition Timeline */}
        <div>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FileText size={16} style={{ color: 'var(--primary)' }} />
            Append-Only State Transition History ({statusEvents.length})
          </h4>

          <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
              <thead style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-default)' }}>
                <tr>
                  <th style={{ padding: '0.5rem 0.75rem' }}>Event Type</th>
                  <th style={{ padding: '0.5rem 0.75rem' }}>Transition</th>
                  <th style={{ padding: '0.5rem 0.75rem' }}>Performed By</th>
                  <th style={{ padding: '0.5rem 0.75rem' }}>Notes</th>
                  <th style={{ padding: '0.5rem 0.75rem' }}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {statusEvents.map((evt) => (
                  <tr key={evt._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '0.5rem 0.75rem', fontWeight: 700 }}>{evt.eventType}</td>
                    <td style={{ padding: '0.5rem 0.75rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{evt.previousStatus}</span> ➔{' '}
                      <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{evt.newStatus}</span>
                    </td>
                    <td style={{ padding: '0.5rem 0.75rem' }}>{evt.performedBy.name}</td>
                    <td style={{ padding: '0.5rem 0.75rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>{evt.notes || '-'}</td>
                    <td style={{ padding: '0.5rem 0.75rem', color: 'var(--text-muted)' }}>{formatDate(evt.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
          <Button variant="outline" onClick={onClose}>
            Close Audit Trail
          </Button>
        </div>
      </div>
    </Modal>
  );
};
