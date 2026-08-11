import React, { useState } from 'react';
import { Search, Sparkles, Plus } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer/PageContainer';
import { Table, type Column } from '../../components/common/Table/Table';
import { Input } from '../../components/common/Input/Input';
import { StatusBadge } from '../../components/shared/StatusBadge/StatusBadge';
import { Button } from '../../components/common/Button/Button';
import { formatDate } from '../../utils/date';

interface DonationRecord {
  id: string;
  donorName: string;
  donorType: string;
  itemsReceived: number;
  totalWeightKg: number;
  intakeDate: string;
  processedBy: string;
  status: 'received' | 'checked' | 'shelved';
}

const mockDonations: DonationRecord[] = [
  { id: 'DON-901', donorName: 'Metro Supermarket Chain', donorType: 'Corporate Retailer', itemsReceived: 320, totalWeightKg: 450, intakeDate: '2026-08-11', processedBy: 'Sarah Clerk', status: 'checked' },
  { id: 'DON-902', donorName: 'Green Valley Bakery', donorType: 'Local Producer', itemsReceived: 140, totalWeightKg: 85, intakeDate: '2026-08-11', processedBy: 'Mark Clerk', status: 'received' },
  { id: 'DON-903', donorName: 'Community Harvest Farm', donorType: 'Agricultural Donor', itemsReceived: 500, totalWeightKg: 890, intakeDate: '2026-08-10', processedBy: 'Sarah Clerk', status: 'shelved' }
];

export const DonationsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDonations = mockDonations.filter((d) =>
    d.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: Column<DonationRecord>[] = [
    {
      header: 'Intake ID',
      render: (d) => (
        <span style={{ fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
          {d.id}
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
      header: 'Items & Net Weight',
      render: (d) => (
        <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
          {d.itemsReceived} units ({d.totalWeightKg} kg)
        </span>
      )
    },
    {
      header: 'Intake Date',
      render: (d) => <span style={{ color: 'var(--text-muted)' }}>{formatDate(d.intakeDate)}</span>
    },
    {
      header: 'Processing Clerk',
      render: (d) => <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{d.processedBy}</span>
    },
    {
      header: 'State',
      render: (d) => <StatusBadge status={d.status} />
    }
  ];

  return (
    <PageContainer
      title="Donation Intakes"
      subtitle="Record incoming food bank donations, parse manifests with AI, and track inspection status"
      actions={
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="outline" leftIcon={<Sparkles size={16} />}>
            AI Manifest Parser
          </Button>
          <Button variant="primary" leftIcon={<Plus size={16} />}>
            New Donation Intake
          </Button>
        </div>
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
            placeholder="Search donor name or intake ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search size={16} />}
          />
        </div>
      </div>

      <Table columns={columns} data={filteredDonations} emptyMessage="No donation records found" />
    </PageContainer>
  );
};
