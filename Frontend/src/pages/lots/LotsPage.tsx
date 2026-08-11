import React, { useState } from 'react';
import { Search, AlertCircle, RefreshCw } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer/PageContainer';
import { Table, type Column } from '../../components/common/Table/Table';
import { Input } from '../../components/common/Input/Input';
import { Select } from '../../components/common/Select/Select';
import { StatusBadge } from '../../components/shared/StatusBadge/StatusBadge';
import { Button } from '../../components/common/Button/Button';
import { formatDate, getDaysUntilExpiry } from '../../utils/date';

interface LotItem {
  id: string;
  lotNumber: string;
  itemName: string;
  category: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  location: string;
  status: 'received' | 'checked' | 'shelved' | 'reserved' | 'released' | 'quarantined' | 'discarded';
}

const mockLots: LotItem[] = [
  { id: '1', lotNumber: 'LOT-2026-081', itemName: 'Organic Fresh Milk', category: 'Dairy', quantity: 120, unit: 'Liters', expiryDate: '2026-08-14', location: 'Cold Rack A-02', status: 'shelved' },
  { id: '2', lotNumber: 'LOT-2026-082', itemName: 'Whole Wheat Bread', category: 'Bakery', quantity: 85, unit: 'Loaves', expiryDate: '2026-08-12', location: 'Shelf B-11', status: 'shelved' },
  { id: '3', lotNumber: 'LOT-2026-083', itemName: 'Canned Tomato Soup', category: 'Canned Goods', quantity: 350, unit: 'Cans', expiryDate: '2027-03-20', location: 'Warehouse Row 4', status: 'shelved' },
  { id: '4', lotNumber: 'LOT-2026-084', itemName: 'Fresh Apples (Fuji)', category: 'Produce', quantity: 200, unit: 'kg', expiryDate: '2026-08-18', location: 'Cold Rack C-01', status: 'checked' },
  { id: '5', lotNumber: 'LOT-2026-085', itemName: 'Peanut Butter Jars', category: 'Pantry', quantity: 95, unit: 'Jars', expiryDate: '2026-11-05', location: 'Shelf D-04', status: 'reserved' },
  { id: '6', lotNumber: 'LOT-2026-086', itemName: 'Unpasteurized Juice Batch', category: 'Beverages', quantity: 40, unit: 'Bottles', expiryDate: '2026-08-11', location: 'Quarantine Bin 1', status: 'quarantined' }
];

export const LotsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredLots = mockLots.filter((lot) => {
    const matchesSearch =
      lot.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lot.lotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lot.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lot.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns: Column<LotItem>[] = [
    {
      header: 'Lot Reference',
      render: (item) => (
        <div>
          <div style={{ fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
            {item.lotNumber}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.location}</div>
        </div>
      )
    },
    {
      header: 'Food Item & Category',
      render: (item) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{item.itemName}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.category}</span>
        </div>
      )
    },
    {
      header: 'Stock Quantity',
      render: (item) => (
        <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
          {item.quantity} {item.unit}
        </span>
      )
    },
    {
      header: 'Expiry & FEFO Risk',
      render: (item) => {
        const daysLeft = getDaysUntilExpiry(item.expiryDate);
        const isUrgent = daysLeft <= 3;
        return (
          <div>
            <div style={{ fontWeight: 600, color: isUrgent ? 'var(--accent-red)' : 'var(--text-main)' }}>
              {formatDate(item.expiryDate)}
            </div>
            <div style={{ fontSize: '0.75rem', color: isUrgent ? 'var(--accent-red)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              {isUrgent && <AlertCircle size={12} />}
              {daysLeft <= 0 ? 'Expired' : `${daysLeft} days left`}
            </div>
          </div>
        );
      }
    },
    {
      header: 'Current State',
      render: (item) => <StatusBadge status={item.status} />
    }
  ];

  return (
    <PageContainer
      title="Stock & Lot FEFO Management"
      subtitle="Track warehouse food lots, expiration windows, and strict FEFO priority queues"
      actions={
        <Button variant="outline" leftIcon={<RefreshCw size={15} />}>
          Run FEFO Recalculation
        </Button>
      }
    >
      {/* Search & Filter Toolbar */}
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
        <div style={{ flex: 1, minWidth: '240px' }}>
          <Input
            placeholder="Search lot number, food item, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search size={16} />}
          />
        </div>

        <div style={{ width: '220px' }}>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Lot States' },
              { value: 'received', label: 'Received' },
              { value: 'checked', label: 'Checked' },
              { value: 'shelved', label: 'Shelved' },
              { value: 'reserved', label: 'Reserved' },
              { value: 'quarantined', label: 'Quarantined' }
            ]}
          />
        </div>
      </div>

      <Table columns={columns} data={filteredLots} emptyMessage="No lots match the specified filters" />
    </PageContainer>
  );
};
