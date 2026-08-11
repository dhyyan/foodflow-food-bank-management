import React, { useEffect } from 'react';
import { Building2, Calendar, UserCheck, Package, Boxes, Loader as SpinnerIcon } from 'lucide-react';
import { Modal } from '../../../components/common/Modal/Modal';
import { StatusBadge } from '../../../components/shared/StatusBadge/StatusBadge';
import { Table, type Column } from '../../../components/common/Table/Table';
import { Button } from '../../../components/common/Button/Button';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchDonationById, clearCurrentDonation } from '../donationSlice';
import type { DonationLineRecord, LotRecord } from '../donation.types';
import { formatDate } from '../../../utils/date';

interface DonationDetailsModalProps {
  donationId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DonationDetailsModal: React.FC<DonationDetailsModalProps> = ({
  donationId,
  isOpen,
  onClose
}) => {
  const dispatch = useAppDispatch();
  const { currentDonation, currentLots, detailLoading } = useAppSelector(
    (state) => state.donations
  );

  useEffect(() => {
    if (isOpen && donationId) {
      dispatch(fetchDonationById(donationId));
    } else {
      dispatch(clearCurrentDonation());
    }
  }, [isOpen, donationId, dispatch]);

  const lineColumns: Column<DonationLineRecord>[] = [
    {
      header: 'Item Description',
      render: (line) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{line.itemName}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{line.category}</div>
        </div>
      )
    },
    {
      header: 'Quantity',
      render: (line) => (
        <span style={{ fontWeight: 700, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
          {line.quantity} {line.unit}
        </span>
      )
    },
    {
      header: 'Printed Expiry Date',
      render: (line) => (
        <span style={{ color: line.printedExpiryDate ? 'var(--text-main)' : 'var(--text-light)' }}>
          {line.printedExpiryDate ? formatDate(line.printedExpiryDate) : 'N/A'}
        </span>
      )
    }
  ];

  const lotColumns: Column<LotRecord>[] = [
    {
      header: 'Lot Number',
      render: (lot) => (
        <span style={{ fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
          {lot.lotNumber}
        </span>
      )
    },
    {
      header: 'Item',
      render: (lot) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{lot.itemName}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lot.category}</div>
        </div>
      )
    },
    {
      header: 'Available Stock',
      render: (lot) => (
        <span style={{ fontWeight: 700, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
          {lot.availableQuantity} / {lot.quantity} {lot.unit}
        </span>
      )
    },
    {
      header: 'Printed Expiry',
      render: (lot) => (
        <span style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>
          {lot.printedExpiryDate ? formatDate(lot.printedExpiryDate) : 'None'}
        </span>
      )
    },
    {
      header: 'Effective Expiry (Safety Margin)',
      render: (lot) => (
        <div>
          {lot.effectiveExpiryDate ? (
            <span style={{ fontWeight: 700, color: '#d97706', fontSize: '0.85rem' }}>
              {formatDate(lot.effectiveExpiryDate)}
            </span>
          ) : (
            <span style={{ color: 'var(--text-light)', fontSize: '0.83rem' }}>Indefinite</span>
          )}
        </div>
      )
    },
    {
      header: 'Lot Lifecycle State',
      render: (lot) => <StatusBadge status={lot.status} />
    }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={currentDonation ? `Donation Record: ${currentDonation.donationNumber}` : 'Donation Details'}
      subtitle="Complete record of intake lines and automatically created inventory lots"
      maxWidth="900px"
    >
      {detailLoading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <SpinnerIcon className="animate-spin" size={28} style={{ margin: '0 auto 0.75rem', color: 'var(--primary)' }} />
          <p>Loading donation details & lot tracking...</p>
        </div>
      ) : !currentDonation ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          No donation information found.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Top Banner Card */}
          <div
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-default)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr',
              gap: '1rem'
            }}
          >
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Building2 size={13} /> Donor Name
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                {currentDonation.donorName}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{currentDonation.donorType}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Calendar size={13} /> Intake Date
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                {formatDate(currentDonation.receivedAt)}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <UserCheck size={13} /> Recorded By Clerk
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                {currentDonation.receivedBy.name}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Donation Status
              </div>
              <div style={{ marginTop: '0.35rem' }}>
                <StatusBadge status={currentDonation.status} />
              </div>
            </div>
          </div>

          {/* Section 1: Donated Line Items */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.65rem' }}>
              <Package size={16} style={{ color: 'var(--primary)' }} />
              Donated Line Items ({currentDonation.lines.length})
            </h4>
            <Table columns={lineColumns} data={currentDonation.lines} emptyMessage="No line items found" />
          </div>

          {/* Section 2: Created Inventory Lots */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.65rem' }}>
              <Boxes size={16} style={{ color: 'var(--primary)' }} />
              Generated Inventory Lots ({currentLots.length})
            </h4>
            <Table columns={lotColumns} data={currentLots} emptyMessage="No inventory lots generated yet" />
          </div>

          {/* Close Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
            <Button variant="outline" onClick={onClose}>
              Close Details
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
