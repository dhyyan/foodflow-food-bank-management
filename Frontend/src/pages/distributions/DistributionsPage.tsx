import React, { useState, useEffect } from 'react';
import { Search, Plus, Shield } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer/PageContainer';
import { Table, type Column } from '../../components/common/Table/Table';
import { Input } from '../../components/common/Input/Input';
import { StatusBadge } from '../../components/shared/StatusBadge/StatusBadge';
import { Button } from '../../components/common/Button/Button';
import { formatDate } from '../../utils/date';
import { CreateDistributionModal } from '../../features/distributions/components/CreateDistributionModal';
import apiClient from '../../services/api/apiClient';

interface DistributionRecord {
  _id: string;
  distributionNumber: string;
  recipientName: string;
  familyCount: number;
  allocationPolicy?: string;
  status: 'reserved' | 'released';
  createdAt: string;
  createdBy?: { name: string };
}

export const DistributionsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [distributions, setDistributions] = useState<DistributionRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDistributions = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/distributions');
      if (res.data && res.data.data) {
        setDistributions(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load distributions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDistributions();
  }, []);

  const filteredDistributions = distributions.filter((d) =>
    (d.recipientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.distributionNumber || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Serving {d.familyCount || 1} Families</div>
        </div>
      )
    },
    {
      header: 'Allocation Strategy Policy',
      render: (d) => (
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: d.allocationPolicy === 'STRATEGIC_RESERVE' ? '#1e40af' : 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          {d.allocationPolicy === 'STRATEGIC_RESERVE' && <Shield size={13} />}
          {d.allocationPolicy === 'STRATEGIC_RESERVE' ? 'Strategic Reserve Buffer' : 'Standard FEFO'}
        </span>
      )
    },
    {
      header: 'Created Date',
      render: (d) => <span style={{ color: 'var(--text-muted)', fontSize: '0.83rem' }}>{formatDate(d.createdAt)}</span>
    },
    {
      header: 'Handout Coordinator',
      render: (d) => <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{d.createdBy?.name || 'Staff Coordinator'}</span>
    },
    {
      header: 'Status',
      render: (d) => <StatusBadge status={d.status} />
    }
  ];

  return (
    <PageContainer
      title="Food Distributions"
      subtitle="Manage outbound family handouts, FEFO lot reservations, and strategic reserve allocations"
      actions={
        <Button variant="primary" leftIcon={<Plus size={16} />} onClick={() => setIsModalOpen(true)}>
          Schedule New Distribution
        </Button>
      }
    >
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
            placeholder="Search recipient organization or distribution ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search size={16} />}
          />
        </div>
      </div>

      <Table
        columns={columns}
        data={filteredDistributions}
        emptyMessage={loading ? 'Loading distributions...' : 'No distribution records found. Create your first distribution request above.'}
      />

      <CreateDistributionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetchDistributions();
        }}
      />
    </PageContainer>
  );
};
