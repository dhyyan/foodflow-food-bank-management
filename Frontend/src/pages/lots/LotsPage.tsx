import React, { useEffect, useState } from 'react';
import {
  Search,
  AlertCircle,
  RefreshCw,
  GitCommit,
  Eye,
  ArrowUpDown,
  AlertTriangle,
  Truck,
  History,
  QrCode
} from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer/PageContainer';
import { Table, type Column } from '../../components/common/Table/Table';
import { Input } from '../../components/common/Input/Input';
import { Select } from '../../components/common/Select/Select';
import { StatusBadge } from '../../components/shared/StatusBadge/StatusBadge';
import { Button } from '../../components/common/Button/Button';
import { Pagination } from '../../components/common/Pagination/Pagination';
import { Loader } from '../../components/common/Loader/Loader';
import { EmptyState } from '../../components/common/EmptyState/EmptyState';
import { ErrorState } from '../../components/common/ErrorState/ErrorState';
import { formatDate, getDaysUntilExpiry } from '../../utils/date';
import { useLots } from '../../features/lots/hooks/useLots';
import type { LotItem } from '../../features/lots/lot.types';
import { LotDetailsModal } from '../../features/lots/components/LotDetailsModal';
import { LotTraceModal } from '../../features/lots/components/LotTraceModal';
import { LotStatusTransitionModal } from '../../features/lots/components/LotStatusTransitionModal';
import { WarehouseTransferModal } from '../../features/warehouses/components/WarehouseTransferModal';
import { FieldAuditTrailModal } from '../../features/lots/components/FieldAuditTrailModal';
import { PrintLotLabelModal } from '../../features/lots/components/PrintLotLabelModal';

export const LotsPage: React.FC = () => {
  const {
    lots,
    total,
    page,
    totalPages,
    filters,
    loading,
    error,
    successMessage,
    loadLots,
    updateFilters,
    changePage,
    resetFilterState,
    resetAlerts
  } = useLots();

  // Local Modal States
  const [activeModalLot, setActiveModalLot] = useState<LotItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isTraceOpen, setIsTraceOpen] = useState(false);
  const [isTransitionOpen, setIsTransitionOpen] = useState(false);
  const [transitionDefaultTarget, setTransitionDefaultTarget] = useState<string | undefined>();
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);

  // Fetch lots on initial load
  useEffect(() => {
    loadLots();
  }, [loadLots]);

  // Handle Search Input Change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ search: e.target.value });
  };

  // Handle Category Filter Change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilters({ category: e.target.value });
  };

  // Handle Status Filter Change
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilters({ status: e.target.value });
  };

  // Handle Expiry Filter Change
  const handleExpiryStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilters({ expiryStatus: e.target.value as any });
  };

  // Handle Sort By Change
  const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilters({ sortBy: e.target.value as any });
  };

  // Toggle Sort Order
  const toggleSortOrder = () => {
    const nextOrder = filters.sortOrder === 'asc' ? 'desc' : 'asc';
    updateFilters({ sortOrder: nextOrder });
  };

  // Open Details Modal
  const handleOpenDetails = (lot: LotItem) => {
    setActiveModalLot(lot);
    setIsDetailsOpen(true);
  };

  // Open Trace Modal
  const handleOpenTrace = (lot: LotItem) => {
    setActiveModalLot(lot);
    setIsTraceOpen(true);
  };

  // Open Transition Modal
  const handleOpenTransition = (lot: LotItem, defaultTarget?: string) => {
    setActiveModalLot(lot);
    setTransitionDefaultTarget(defaultTarget);
    setIsTransitionOpen(true);
  };

  // Table Columns Setup
  const columns: Column<LotItem>[] = [
    {
      header: 'Lot Reference',
      render: (item) => (
        <div>
          <div style={{ fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
            {item.lotNumber}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {item.donorName ? `Donor: ${item.donorName}` : `Received ${formatDate(item.receivedDate)}`}
          </div>
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
      header: 'Available Stock',
      render: (item) => (
        <div>
          <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
            {item.availableQuantity} {item.unit}
          </span>
          {item.availableQuantity < item.quantity && (
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Total intake: {item.quantity} {item.unit}
            </div>
          )}
        </div>
      )
    },
    {
      header: 'Expiry & Safety Boundary',
      render: (item) => {
        const effectiveDateStr = item.effectiveExpiryDate || item.printedExpiryDate;
        if (!effectiveDateStr) {
          return <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No Expiry Date</span>;
        }

        const daysLeft = getDaysUntilExpiry(effectiveDateStr);
        const isExpired = daysLeft <= 0;
        const isExpiringSoon = daysLeft > 0 && daysLeft <= 3;

        return (
          <div>
            <div
              style={{
                fontWeight: 700,
                fontSize: '0.85rem',
                color: isExpired ? 'var(--accent-red)' : isExpiringSoon ? 'var(--accent-amber)' : 'var(--text-main)'
              }}
            >
              {formatDate(effectiveDateStr)}
            </div>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: isExpired ? 'var(--accent-red)' : isExpiringSoon ? 'var(--accent-amber)' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem',
                marginTop: '0.1rem'
              }}
            >
              {isExpired ? (
                <>
                  <AlertTriangle size={13} /> ❌ Expired (-{Math.abs(daysLeft)}d)
                </>
              ) : isExpiringSoon ? (
                <>
                  <AlertCircle size={13} /> ⚠️ Expiring soon ({daysLeft}d left)
                </>
              ) : (
                <>{daysLeft} days left</>
              )}
            </div>
          </div>
        );
      }
    },
    {
      header: 'Current State',
      render: (item) => <StatusBadge status={item.status} />
    },
    {
      header: 'Actions',
      render: (item) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          {/* Inspection / Shelving / Quarantine / Discard Action buttons depending on state */}
          {item.status === 'received' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleOpenTransition(item, 'checked')}
              title="Inspect food lot"
            >
              Inspect
            </Button>
          )}

          {item.status === 'checked' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleOpenTransition(item, 'shelved')}
              title="Shelve passed lot"
            >
              Shelve
            </Button>
          )}

          {item.status === 'shelved' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenTransition(item, 'quarantined')}
              title="Flag or quarantine lot"
            >
              Quarantine
            </Button>
          )}

          {item.status === 'quarantined' && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleOpenTransition(item, 'discarded')}
              title="Discard food lot"
            >
              Discard
            </Button>
          )}

          {/* Transfer Warehouse Stock Button */}
          {item.status === 'shelved' && item.availableQuantity > 0 && (
            <button
              onClick={() => {
                setActiveModalLot(item);
                setIsTransferOpen(true);
              }}
              title="Inter-Warehouse Transfer"
              style={{
                padding: '0.35rem 0.5rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-default)',
                backgroundColor: '#eff6ff',
                color: '#1e40af',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.78rem'
              }}
            >
              <Truck size={14} style={{ color: '#2563eb' }} />
            </button>
          )}

          {/* Field-Level Audit Trail Button */}
          <button
            onClick={() => {
              setActiveModalLot(item);
              setIsAuditOpen(true);
            }}
            title="View Full Field Change Audit Trail"
            style={{
              padding: '0.35rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-default)',
              backgroundColor: '#f0fdf4',
              color: '#166534',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.78rem'
            }}
          >
            <History size={14} style={{ color: '#16a34a' }} />
          </button>

          {/* Printable Barcode Label Tag Button */}
          <button
            onClick={() => {
              setActiveModalLot(item);
              setIsQROpen(true);
            }}
            title="Generate & Print Barcode Label"
            style={{
              padding: '0.35rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-default)',
              backgroundColor: '#faf5ff',
              color: '#6b21a8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.78rem'
            }}
          >
            <QrCode size={14} style={{ color: '#9333ea' }} />
          </button>

          {/* Trace Button */}
          <button
            onClick={() => handleOpenTrace(item)}
            title="View Lot Traceability History"
            style={{
              padding: '0.35rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-default)',
              backgroundColor: '#ffffff',
              color: 'var(--text-main)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.78rem'
            }}
          >
            <GitCommit size={14} style={{ color: 'var(--primary)' }} />
          </button>

          {/* View Details Button */}
          <button
            onClick={() => handleOpenDetails(item)}
            title="View Details"
            style={{
              padding: '0.35rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-default)',
              backgroundColor: '#ffffff',
              color: 'var(--text-main)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.78rem'
            }}
          >
            <Eye size={14} />
          </button>
        </div>
      )
    }
  ];

  return (
    <PageContainer
      title="Stock & Inventory Lot Management"
      subtitle="Stock Manager workspace: Inspect physical food, shelve available stock, quarantine bad items, discard expired lots, and trace lot journeys"
      actions={
        <Button variant="outline" leftIcon={<RefreshCw size={15} />} onClick={() => loadLots()}>
          Refresh Inventory
        </Button>
      }
    >
      {/* Success Toast / Alert */}
      {successMessage && (
        <div
          style={{
            padding: '0.85rem 1.25rem',
            marginBottom: '1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary-light)',
            border: '1px solid var(--primary-border)',
            color: 'var(--primary)',
            fontSize: '0.88rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <span>{successMessage}</span>
          <button
            onClick={resetAlerts}
            style={{ border: 'none', background: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 700 }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Search & Multi-Filter Toolbar */}
      <div
        className="card"
        style={{
          padding: '1rem 1.25rem',
          marginBottom: '1.25rem',
          display: 'flex',
          gap: '0.85rem',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}
      >
        {/* Search */}
        <div style={{ flex: 2, minWidth: '220px' }}>
          <Input
            placeholder="Search lot number, food item, or category..."
            value={filters.search || ''}
            onChange={handleSearchChange}
            leftIcon={<Search size={16} />}
          />
        </div>

        {/* Category Filter */}
        <div style={{ flex: 1, minWidth: '150px' }}>
          <Select
            value={filters.category || 'all'}
            onChange={handleCategoryChange}
            options={[
              { value: 'all', label: 'All Categories' },
              { value: 'Dairy', label: 'Dairy' },
              { value: 'Produce', label: 'Produce' },
              { value: 'Bakery', label: 'Bakery' },
              { value: 'Canned Goods', label: 'Canned Goods' },
              { value: 'Pantry', label: 'Pantry' },
              { value: 'Beverages', label: 'Beverages' },
              { value: 'General', label: 'General' }
            ]}
          />
        </div>

        {/* Status Filter */}
        <div style={{ flex: 1, minWidth: '150px' }}>
          <Select
            value={filters.status || 'all'}
            onChange={handleStatusChange}
            options={[
              { value: 'all', label: 'All Lot States' },
              { value: 'received', label: 'Received' },
              { value: 'checked', label: 'Checked' },
              { value: 'shelved', label: 'Shelved' },
              { value: 'reserved', label: 'Reserved' },
              { value: 'released', label: 'Released' },
              { value: 'quarantined', label: 'Quarantined' },
              { value: 'discarded', label: 'Discarded' }
            ]}
          />
        </div>

        {/* Expiry Risk Filter */}
        <div style={{ flex: 1, minWidth: '160px' }}>
          <Select
            value={filters.expiryStatus || 'all'}
            onChange={handleExpiryStatusChange}
            options={[
              { value: 'all', label: 'All Expiry Windows' },
              { value: 'expiring_soon', label: '⚠️ Expiring Soon' },
              { value: 'expired', label: '❌ Expired' }
            ]}
          />
        </div>

        {/* Sort Field */}
        <div style={{ flex: 1, minWidth: '170px' }}>
          <Select
            value={filters.sortBy || 'receivedDate'}
            onChange={handleSortByChange}
            options={[
              { value: 'receivedDate', label: 'Sort by Received Date' },
              { value: 'effectiveExpiryDate', label: 'Sort by Effective Expiry' },
              { value: 'quantity', label: 'Sort by Quantity' },
              { value: 'lotNumber', label: 'Sort by Lot Ref #' }
            ]}
          />
        </div>

        {/* Sort Order Toggle */}
        <button
          onClick={toggleSortOrder}
          title={`Order: ${filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
          style={{
            padding: '0.65rem 0.85rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-default)',
            backgroundColor: '#ffffff',
            color: 'var(--text-main)',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.85rem'
          }}
        >
          <ArrowUpDown size={15} />
          {filters.sortOrder === 'asc' ? 'ASC' : 'DESC'}
        </button>

        {/* Reset Filters */}
        <Button variant="outline" size="sm" onClick={resetFilterState}>
          Reset
        </Button>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div style={{ padding: '3rem 0', display: 'flex', justifyContent: 'center' }}>
          <Loader text="Loading food bank inventory lots..." />
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={() => loadLots()} />
      ) : lots.length === 0 ? (
        <EmptyState
          title="No Food Lots Found"
          description="No inventory lots match the specified search or filter criteria."
          actionLabel="Clear Filters"
          onAction={resetFilterState}
        />
      ) : (
        <>
          <Table columns={columns} data={lots} emptyMessage="No lots match the specified filters" />

          {/* Pagination Toolbar */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={total}
            pageSize={filters.limit || 10}
            onPageChange={changePage}
          />
        </>
      )}

      {/* Feature Modals */}
      <LotDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        lot={activeModalLot}
        onOpenTransitionModal={handleOpenTransition}
        onOpenTraceModal={handleOpenTrace}
      />

      <LotTraceModal
        isOpen={isTraceOpen}
        onClose={() => setIsTraceOpen(false)}
        lot={activeModalLot}
      />

      <LotStatusTransitionModal
        isOpen={isTransitionOpen}
        onClose={() => setIsTransitionOpen(false)}
        lot={activeModalLot}
        defaultTargetStatus={transitionDefaultTarget}
      />

      <WarehouseTransferModal
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        lot={activeModalLot}
        onSuccess={() => loadLots()}
      />

      <FieldAuditTrailModal
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
        lot={activeModalLot}
      />

      <PrintLotLabelModal
        isOpen={isQROpen}
        onClose={() => setIsQROpen(false)}
        lot={activeModalLot}
      />
    </PageContainer>
  );
};
