import React, { useEffect } from 'react';
import { Layers, ShieldAlert, Check, AlertTriangle } from 'lucide-react';
import { Modal } from '../../../components/common/Modal/Modal';
import { Button } from '../../../components/common/Button/Button';
import { Loader } from '../../../components/common/Loader/Loader';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchFEFOPreview, confirmReservation, clearMessages } from '../distributionSlice';
import { formatDate } from '../../../utils/date';

interface FEFOPreviewModalProps {
  distributionId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const FEFOPreviewModal: React.FC<FEFOPreviewModalProps> = ({
  distributionId,
  isOpen,
  onClose,
  onSuccess
}) => {
  const dispatch = useAppDispatch();
  const { activePreview, previewLoading, actionLoading, error } = useAppSelector(
    (state) => state.distribution
  );

  useEffect(() => {
    if (isOpen && distributionId) {
      dispatch(clearMessages());
      dispatch(fetchFEFOPreview(distributionId));
    }
  }, [isOpen, distributionId, dispatch]);

  const handleConfirm = async () => {
    if (!distributionId) return;
    const result = await dispatch(confirmReservation(distributionId));
    if (confirmReservation.fulfilled.match(result)) {
      if (onSuccess) onSuccess();
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="FEFO Reservation Preview"
      subtitle="Backend First-Expired-First-Out allocation preview based on eligible shelved lots"
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
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <ShieldAlert size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {previewLoading ? (
          <div style={{ padding: '3rem 0', textAlign: 'center' }}>
            <Loader text="Calculating FEFO inventory allocation across non-expired lots..." />
          </div>
        ) : activePreview ? (
          <>
            {/* Header info card */}
            <div
              style={{
                backgroundColor: 'var(--bg-subtle)',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
                  Distribution Request #{activePreview.distributionNumber}
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.15rem' }}>
                  {activePreview.recipientName} ({activePreview.recipientType})
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    padding: '0.3rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: activePreview.isFullyFulfilled ? '#dcfce7' : '#fef3c7',
                    color: activePreview.isFullyFulfilled ? '#15803d' : '#b45309',
                    border: activePreview.isFullyFulfilled ? '1px solid #86efac' : '1px solid #fde68a'
                  }}
                >
                  {activePreview.isFullyFulfilled ? '✓ 100% Stock Available' : '⚠️ Partial Allocation'}
                </span>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Total Requested: {activePreview.totalRequestedUnits} units | Allocated: {activePreview.totalAllocatedUnits} units
                </div>
              </div>
            </div>

            {/* FEFO Reservation Preview Table */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {activePreview.items.map((item, itemIdx) => (
                <div
                  key={itemIdx}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      padding: '0.75rem 1rem',
                      backgroundColor: '#f8fafc',
                      borderBottom: '1px solid var(--border-light)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                      {item.itemName}
                    </div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                      Requested: {item.requestedQuantity} {item.unit} | Allocated: <span style={{ color: 'var(--primary)' }}>{item.allocatedQuantity} {item.unit}</span>
                    </div>
                  </div>

                  {item.allocations.length === 0 ? (
                    <div style={{ padding: '1rem', color: '#dc2626', fontSize: '0.85rem', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <AlertTriangle size={16} />
                      No eligible non-expired shelved stock found in inventory for {item.itemName}.
                    </div>
                  ) : (
                    <div style={{ padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {item.allocations.map((alloc, allocIdx) => (
                        <div
                          key={allocIdx}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.6rem 0.85rem',
                            backgroundColor: 'var(--bg-subtle)',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-light)',
                            fontSize: '0.85rem'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            <Layers size={16} style={{ color: 'var(--primary)' }} />
                            <div>
                              <span style={{ fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
                                {alloc.lotNumber}
                              </span>
                              {alloc.effectiveExpiryDate && (
                                <span style={{ marginLeft: '0.65rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                  Effective Expiry: <strong style={{ color: '#0369a1' }}>{formatDate(alloc.effectiveExpiryDate)}</strong> ({alloc.safetyMarginDays}-day safety margin)
                                </span>
                              )}
                            </div>
                          </div>
                          <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.9rem' }}>
                            Allocated: <span style={{ color: 'var(--primary)', fontSize: '1rem' }}>{alloc.allocatedQuantity}</span> {alloc.unit}
                          </div>
                        </div>
                      ))}

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          paddingTop: '0.5rem',
                          marginTop: '0.25rem',
                          borderTop: '1px dashed var(--border-light)',
                          fontWeight: 800,
                          fontSize: '0.88rem',
                          color: 'var(--text-main)'
                        }}
                      >
                        <span>Total Allocation for {item.itemName}</span>
                        <span>{item.allocatedQuantity} / {item.requestedQuantity} {item.unit}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ backgroundColor: '#eff6ff', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid #bfdbfe', fontSize: '0.8rem', color: '#1e40af' }}>
              <strong>🔒 Concurrency protection:</strong> Upon clicking Confirm, the backend re-validates stock, checks quotas, applies FEFO, updates lot availability, and records lot events atomically.
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                isLoading={actionLoading}
                disabled={!activePreview.isFullyFulfilled}
                onClick={handleConfirm}
                leftIcon={<Check size={16} />}
              >
                Confirm Reservation
              </Button>
            </div>
          </>
        ) : (
          <div style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            No preview available
          </div>
        )}
      </div>
    </Modal>
  );
};
