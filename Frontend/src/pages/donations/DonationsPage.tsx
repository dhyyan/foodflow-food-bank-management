import React, { useEffect, useState } from 'react';
import { Search, Sparkles, Plus, Eye, RefreshCw, AlertCircle } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer/PageContainer';
import { Table, type Column } from '../../components/common/Table/Table';
import { Input } from '../../components/common/Input/Input';
import { Select } from '../../components/common/Select/Select';
import { StatusBadge } from '../../components/shared/StatusBadge/StatusBadge';
import { Button } from '../../components/common/Button/Button';
import { Loader } from '../../components/common/Loader/Loader';
import { formatDate } from '../../utils/date';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchDonations } from '../../features/donations/donationSlice';
import type { DonationRecord } from '../../features/donations/donation.types';
import { CreateDonationModal } from '../../features/donations/components/CreateDonationModal';
import { DonationDetailsModal } from '../../features/donations/components/DonationDetailsModal';
import { AIManifestParserModal } from '../../features/ai/components/AIManifestParserModal';

const DONOR_FILTER_OPTIONS = [
  { value: 'all', label: 'All Donor Types' },
  { value: 'Supermarket', label: 'Supermarket / Retailer' },
  { value: 'Restaurant', label: 'Restaurant / Catering' },
  { value: 'Individual', label: 'Individual Donor' },
  { value: 'Corporate', label: 'Corporate Sponsor' },
  { value: 'Agricultural Farm', label: 'Farm / Agriculture' },
  { value: 'Bakery', label: 'Bakery' },
  { value: 'Other', label: 'Other Organizations' }
];

export const DonationsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { donations, loading, error } = useAppSelector((state) => state.donations);

  const [searchTerm, setSearchTerm] = useState('');
  const [donorTypeFilter, setDonorTypeFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [selectedDonationId, setSelectedDonationId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    dispatch(
      fetchDonations({
        search: searchTerm,
        donorType: donorTypeFilter
      })
    );
  }, [dispatch, searchTerm, donorTypeFilter]);

  const handleRefresh = () => {
    dispatch(
      fetchDonations({
        search: searchTerm,
        donorType: donorTypeFilter
      })
    );
  };

  const handleViewDetails = (donationId: string) => {
    setSelectedDonationId(donationId);
    setIsDetailModalOpen(true);
  };

  const columns: Column<DonationRecord>[] = [
    {
      header: 'Intake Number',
      render: (d) => (
        <span style={{ fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
          {d.donationNumber}
        </span>
      )
    },
    {
      header: 'Donor Organization',
      render: (d) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{d.donorName}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{d.donorType}</div>
        </div>
      )
    },
    {
      header: 'Total Items Intake',
      render: (d) => (
        <div>
          <span style={{ fontWeight: 700, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
            {d.totalQuantity} units
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
            ({d.totalLines} donated item {d.totalLines === 1 ? 'line' : 'lines'})
          </span>
        </div>
      )
    },
    {
      header: 'Intake Date',
      render: (d) => <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{formatDate(d.receivedAt)}</span>
    },
    {
      header: 'Processing Clerk',
      render: (d) => <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{d.receivedBy.name}</span>
    },
    {
      header: 'Intake State',
      render: (d) => <StatusBadge status={d.status} />
    },
    {
      header: 'Actions',
      render: (d) => (
        <Button
          variant="outline"
          size="sm"
          leftIcon={<Eye size={14} />}
          onClick={(e) => {
            e.stopPropagation();
            handleViewDetails(d.id);
          }}
        >
          View Details
        </Button>
      )
    }
  ];

  return (
    <PageContainer
      title="Donation Intakes"
      subtitle="Record incoming food bank donations, generate inventory lots, and inspect donor intake details"
      actions={
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button
            variant="outline"
            leftIcon={<Sparkles size={16} />}
            onClick={() => setIsAIModalOpen(true)}
          >
            AI Manifest Parser
          </Button>
          <Button
            variant="primary"
            leftIcon={<Plus size={16} />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            New Donation Intake
          </Button>
        </div>
      }
    >
      {/* Search and Filters Header */}
      <div
        className="card"
        style={{
          padding: '1rem 1.25rem',
          marginBottom: '1.25rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ flex: 2, minWidth: '240px' }}>
          <Input
            placeholder="Search donor organization or intake number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search size={16} />}
          />
        </div>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <Select
            options={DONOR_FILTER_OPTIONS}
            value={donorTypeFilter}
            onChange={(e) => setDonorTypeFilter(e.target.value)}
          />
        </div>
        <Button variant="outline" size="md" leftIcon={<RefreshCw size={15} />} onClick={handleRefresh}>
          Refresh
        </Button>
      </div>

      {/* Error state */}
      {error && (
        <div
          style={{
            padding: '1rem',
            marginBottom: '1.25rem',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#991b1b',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Table & Loading */}
      {loading && donations.length === 0 ? (
        <Loader text="Fetching donation intakes..." />
      ) : (
        <Table
          columns={columns}
          data={donations}
          emptyMessage="No donation records found. Click 'New Donation Intake' to record a donation."
        />
      )}

      {/* Modal: AI Manifest Parser */}
      <AIManifestParserModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onSuccess={handleRefresh}
      />

      {/* Modal: New Donation Intake */}
      <CreateDonationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleRefresh}
      />

      {/* Modal: Donation & Created Lots Details */}
      <DonationDetailsModal
        donationId={selectedDonationId}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedDonationId(null);
        }}
      />
    </PageContainer>
  );
};
