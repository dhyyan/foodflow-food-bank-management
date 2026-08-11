import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer/PageContainer';
import { Table, type Column } from '../../components/common/Table/Table';
import { Input } from '../../components/common/Input/Input';
import { StatusBadge } from '../../components/shared/StatusBadge/StatusBadge';
import { Button } from '../../components/common/Button/Button';
import { formatDate } from '../../utils/date';

interface DistributionRecord {
  id: string;
  recipientOrg: string;
  familyCount: number;
  allocatedLotsCount: number;
  totalUnits: number;
  handoutDate: string;
  coordinator: string;
  status: 'reserved' | 'released';
}

const mockDistributions: DistributionRecord[] = [
  { id: 'DST-401', recipientOrg: 'Hope Community Shelter', familyCount: 45, allocatedLotsCount: 4, totalUnits: 180, handoutDate: '2026-08-11', coordinator: 'David Coordinator', status: 'released' },
  { id: 'DST-402', recipientOrg: 'St. Jude Family Care', familyCount: 20, allocatedLotsCount: 2, totalUnits: 90, handoutDate: '2026-08-12', coordinator: 'David Coordinator', status: 'reserved' }
];

export const DistributionsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDistributions = mockDistributions.filter((d) =>
    d.recipientOrg.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: Column<DistributionRecord>[] = [
    {
      header: 'Distribution ID',
      render: (d) => (
        <span style={{ fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
          {d.id}
        </span>
      )
    },
    {
      header: 'Recipient Entity',
      render: (d) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{d.recipientOrg}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Serving {d.familyCount} Families</div>
        </div>
      )
    },
    {
      header: 'Allocated Lots & Units',
      render: (d) => (
        <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
          {d.allocatedLotsCount} Lots ({d.totalUnits} Units)
        </span>
      )
    },
    {
      header: 'Scheduled Date',
      render: (d) => <span style={{ color: 'var(--text-muted)' }}>{formatDate(d.handoutDate)}</span>
    },
    {
      header: 'Handout Coordinator',
      render: (d) => <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{d.coordinator}</span>
    },
    {
      header: 'Status',
      render: (d) => <StatusBadge status={d.status} />
    }
  ];

  return (
    <PageContainer
      title="Food Distributions"
      subtitle="Manage outbound family handouts, FEFO lot reservations, and partner agency distributions"
      actions={
        <Button variant="primary" leftIcon={<Plus size={16} />}>
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

      <Table columns={columns} data={filteredDistributions} emptyMessage="No distribution records found" />
    </PageContainer>
  );
};
