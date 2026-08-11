import React, { useState, useEffect } from 'react';
import { Trash2, DollarSign, AlertCircle, Calendar, RefreshCw, Layers } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer/PageContainer';
import { Button } from '../../components/common/Button/Button';
import { Table, type Column } from '../../components/common/Table/Table';
import { StatusBadge } from '../../components/shared/StatusBadge/StatusBadge';
import { formatDate } from '../../utils/date';
import apiClient from '../../services/api/apiClient';

interface WasteCategorySummary {
  category: string;
  discardedQuantity: number;
  estimatedValue: number;
  lotCount: number;
  unit: string;
}

interface WasteItemizedDetail {
  lotId: string;
  lotNumber: string;
  itemName: string;
  category: string;
  quantity: number;
  unit: string;
  estimatedValue: number;
  effectiveExpiryDate?: string;
  discardedAt: string;
  notes?: string;
}

interface WasteReportData {
  startDate: string;
  endDate: string;
  totalQuantity: number;
  totalEstimatedValue: number;
  totalLotsDiscarded: number;
  categoryBreakdown: WasteCategorySummary[];
  itemizedDetails: WasteItemizedDetail[];
}

export const WasteReportPage: React.FC = () => {
  const [startDate, setStartDate] = useState<string>(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(false);
  const [report, setReport] = useState<WasteReportData | null>(null);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/reports/waste', {
        params: {
          startDate,
          endDate,
          category: categoryFilter !== 'all' ? categoryFilter : undefined
        }
      });
      if (res.data && res.data.data) {
        setReport(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load waste report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const columns: Column<WasteItemizedDetail>[] = [
    {
      header: 'Lot Number',
      render: (item) => (
        <span style={{ fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
          #{item.lotNumber}
        </span>
      )
    },
    {
      header: 'Item Name & Category',
      render: (item) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{item.itemName}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.category}</div>
        </div>
      )
    },
    {
      header: 'Quantity Discarded',
      render: (item) => (
        <span style={{ fontWeight: 800, color: 'var(--accent-red)' }}>
          {item.quantity} {item.unit}
        </span>
      )
    },
    {
      header: 'Est. Loss Value ($)',
      render: (item) => (
        <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
          ${item.estimatedValue.toFixed(2)}
        </span>
      )
    },
    {
      header: 'Printed / Effective Expiry',
      render: (item) => (
        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {item.effectiveExpiryDate ? formatDate(item.effectiveExpiryDate) : 'Not specified'}
        </span>
      )
    },
    {
      header: 'Discarded Date',
      render: (item) => (
        <span style={{ fontSize: '0.82rem', color: 'var(--text-subtle)' }}>
          {formatDate(item.discardedAt)}
        </span>
      )
    },
    {
      header: 'Status',
      render: () => <StatusBadge status="discarded" size="sm" />
    }
  ];

  return (
    <PageContainer
      title="Inventory Waste & Expiry Report"
      subtitle="Analyze discarded inventory quantities, monetary food value loss, and category breakdown due to expiration"
      actions={
        <Button variant="outline" leftIcon={<RefreshCw size={16} />} onClick={fetchReport} isLoading={loading}>
          Refresh Report
        </Button>
      }
    >
      {/* Date Range & Category Filter Bar */}
      <div
        className="card"
        style={{
          padding: '1.25rem 1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          gap: '1.25rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          backgroundColor: '#ffffff'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={18} style={{ color: 'var(--primary)' }} />
          <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)' }}>Date Range:</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>From:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{
              padding: '0.45rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              fontSize: '0.85rem'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>To:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{
              padding: '0.45rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              fontSize: '0.85rem'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Category:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              padding: '0.45rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              fontSize: '0.85rem'
            }}
          >
            <option value="all">All Categories</option>
            <option value="Produce">Produce</option>
            <option value="Dairy">Dairy</option>
            <option value="Grains">Grains</option>
            <option value="Canned Goods">Canned Goods</option>
            <option value="Bakery">Bakery</option>
            <option value="Protein">Protein</option>
            <option value="Beverages">Beverages</option>
          </select>
        </div>

        <Button variant="primary" size="sm" onClick={fetchReport} isLoading={loading}>
          Apply Filter
        </Button>
      </div>

      {/* Top 3 Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1.75rem'
        }}
      >
        <div className="card" style={{ borderLeft: '4px solid var(--accent-red)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Total Quantity Discarded
            </span>
            <Trash2 size={20} style={{ color: 'var(--accent-red)' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {report ? report.totalQuantity.toLocaleString() : 0} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>Units / Kg</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginTop: '0.35rem' }}>
            From {report?.totalLotsDiscarded || 0} discarded food lots
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Est. Monetary Food Value Loss
            </span>
            <DollarSign size={20} style={{ color: '#f59e0b' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
            ${report ? report.totalEstimatedValue.toFixed(2) : '0.00'}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginTop: '0.35rem' }}>
            Calculated via category market rates
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              High-Risk Expiry Category
            </span>
            <AlertCircle size={20} style={{ color: 'var(--primary)' }} />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {report && report.categoryBreakdown.length > 0 ? report.categoryBreakdown[0].category : 'None'}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginTop: '0.35rem' }}>
            Highest loss volume category in range
          </div>
        </div>
      </div>

      {/* Category Breakdown Bar Progress */}
      {report && report.categoryBreakdown.length > 0 && (
        <div className="card" style={{ marginBottom: '1.75rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={18} style={{ color: 'var(--primary)' }} />
            Waste Breakdown by Item Category
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {report.categoryBreakdown.map((cat, idx) => {
              const percentage = report.totalEstimatedValue > 0
                ? Math.round((cat.estimatedValue / report.totalEstimatedValue) * 100)
                : 0;

              return (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    <span style={{ color: 'var(--text-main)' }}>{cat.category} ({cat.lotCount} lots)</span>
                    <span style={{ color: 'var(--accent-red)', fontWeight: 700 }}>
                      {cat.discardedQuantity} {cat.unit} (${cat.estimatedValue.toFixed(2)})
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '10px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${Math.max(percentage, 3)}%`,
                        height: '100%',
                        backgroundColor: idx === 0 ? 'var(--accent-red)' : idx === 1 ? '#f59e0b' : 'var(--primary)'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Itemized Table */}
      <div className="card">
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
          Itemized Discarded Lots History
        </h3>
        <Table
          columns={columns}
          data={report?.itemizedDetails || []}
          emptyMessage="No discarded inventory recorded within the selected date range"
        />
      </div>
    </PageContainer>
  );
};
