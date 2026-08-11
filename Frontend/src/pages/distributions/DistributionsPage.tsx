import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer/PageContainer';
import { Table, type Column } from '../../components/common/Table/Table';
import { Input } from '../../components/common/Input/Input';
import { Select } from '../../components/common/Select/Select';
import { StatusBadge } from '../../components/shared/StatusBadge/StatusBadge';
import { Button } from '../../components/common/Button/Button';
import { Loader } from '../../components/common/Loader/Loader';
import { formatDate } from '../../utils/date';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchDistributions,
  setSelectedDistribution,
  completeDistribution,
  clearMessages
} from '../../features/distributions/distributionSlice';
import type { DistributionRecord } from '../../features/distributions/distribution.types';
import { CreateDistributionModal } from '../../features/distributions/components/CreateDistributionModal';
import { FEFOPreviewModal } from '../../features/distributions/components/FEFOPreviewModal';
import { DistributionDetailsModal } from '../../features/distributions/components/DistributionDetailsModal';

const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending FEFO' },
  { value: 'reserved', label: 'Stock Reserved' },
  { value: 'completed', label: 'Completed / Released' }
];

export const DistributionsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    distributions,
    loading,
    selectedDistribution,
    successMessage,
    error
  } = useAppSelector((state) => state.distribution);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [previewDistributionId, setPreviewDistributionId] = useState<string | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchDistributions({ search: searchTerm, status: statusFilter }));
  }, [dispatch, searchTerm, statusFilter]);

  const handleOpenDetails = (dist: DistributionRecord) => {
    dispatch(setSelectedDistribution(dist));
    setIsDetailsModalOpen(true);
  };

  const handleOpenPreview = (dist: DistributionRecord) => {
    setPreviewDistributionId(dist.id);
  };

  const handleComplete = async (dist: DistributionRecord) => {
    await dispatch(completeDistribution(dist.id));
  };

  const columns: Column<DistributionRecord>[] = [
    {
      header: 'Distribution ID',
      render: (d) => (
        <span style={{ fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
          #{d.distributionNumber}
        </span>
      )
    },
    {
      header: 'Recipient Entity',
      render: (d) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{d.recipientName}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'capitalize' }}>
            {d.recipientType}
          </div>
        </div>
      )
    },
    {
      header: 'Requested Items',
      render: (d) => (
        <div style={{ fontSize: '0.82rem', color: 'var(--text-main)' }}>
          {d.items.map((item, idx) => (
            <div key={idx} style={{ fontWeight: 600 }}>
              {item.itemName} &rarr; <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{item.requestedQuantity} {item.unit}</span>
            </div>
          ))}
        </div>
      )
    },
    {
      header: 'Reserved Inventory',
      render: (d) => {
        if (!d.reservations || d.reservations.length === 0) {
          return <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Pending FEFO preview</span>;
        }
        const totalUnits = d.reservations.reduce((sum, r) => sum + r.quantity, 0);
        return (
          <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
            {d.reservations.length} Lot{d.reservations.length > 1 ? 's' : ''} ({totalUnits} Units)
          </span>
        );
      }
    },
    {
      header: 'Created Date',
      render: (d) => <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{formatDate(d.createdAt)}</span>
    },
    {
      header: 'Coordinator',
      render: (d) => <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.82rem' }}>{d.createdBy.name}</span>
    },
    {
      header: 'Status',
      render: (d) => <StatusBadge status={d.status} />
    },
    {
      header: 'Actions',
      render: (d) => (
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {d.status === 'pending' && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => handleOpenPreview(d)}
              leftIcon={<Sparkles size={14} />}
            >
              FEFO Preview
            </Button>
          )}

          {d.status === 'reserved' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleComplete(d)}
              leftIcon={<CheckCircle2 size={14} />}
            >
              Handout Food
            </Button>
          )}

          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleOpenDetails(d)}
            leftIcon={<Eye size={14} />}
          >
            Details
          </Button>
        </div>
      )
    }
  ];

  return (
    <PageContainer
      title="Food Distributions & FEFO Handout"
      subtitle="Manage outbound family handouts, FEFO lot reservations, family quota enforcement, and distribution traceability"
      actions={
        <Button variant="primary" leftIcon={<Plus size={16} />} onClick={() => setIsCreateModalOpen(true)}>
          Create Distribution Request
        </Button>
      }
    >
      {/* Messages */}
      {successMessage && (
        <div
          style={{
            marginBottom: '1rem',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            color: '#166534',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <CheckCircle2 size={18} />
          <span>{successMessage}</span>
          <button
            onClick={() => dispatch(clearMessages())}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#166534', fontWeight: 700 }}
          >
            ✕
          </button>
        </div>
      )}

      {error && (
        <div
          style={{
            marginBottom: '1rem',
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
          <AlertCircle size={18} />
          <span>{error}</span>
          <button
            onClick={() => dispatch(clearMessages())}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#991b1b', fontWeight: 700 }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          padding: '1rem 1.25rem',
          marginBottom: '1.25rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center'
        }}
      >
        <div style={{ flex: 1 }}>
          <Input
            placeholder="Search recipient family/agency or distribution number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search size={16} />}
          />
        </div>
        <div style={{ width: '220px' }}>
          <Select
            options={STATUS_FILTER_OPTIONS}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '3rem 0', textAlign: 'center' }}>
          <Loader text="Loading distribution records..." />
        </div>
      ) : (
        <Table columns={columns} data={distributions} emptyMessage="No distribution records found" />
      )}

      {/* Modals */}
      <CreateDistributionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <FEFOPreviewModal
        distributionId={previewDistributionId}
        isOpen={!!previewDistributionId}
        onClose={() => setPreviewDistributionId(null)}
      />

      <DistributionDetailsModal
        distribution={selectedDistribution}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />
    </PageContainer>
  );
};
