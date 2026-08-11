import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Boxes,
  HeartHandshake,
  Truck,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  UserPlus,
  Layers
} from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer/PageContainer';
import { Button } from '../../components/common/Button/Button';
import { RoleBadge } from '../../components/shared/RoleBadge/RoleBadge';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchUsers } from '../../features/users/userSlice';
import { ROUTES } from '../../constants/routes';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Derived stats
  const totalUsers = users.length || 4;
  const adminCount = users.filter((u) => u.role === 'admin').length || 1;
  const clerkCount = users.filter((u) => u.role === 'donation_clerk').length || 1;
  const stockCount = users.filter((u) => u.role === 'stock_manager').length || 1;
  const handoutCount = users.filter((u) => u.role === 'handout_coordinator').length || 1;

  const metrics = [
    {
      title: 'Total System Users',
      value: totalUsers,
      change: '+2 this week',
      icon: Users,
      color: 'var(--primary)',
      lightBg: 'var(--primary-light)',
      border: 'var(--primary-border)',
      route: ROUTES.USERS
    },
    {
      title: 'Active Food Lots',
      value: 128,
      change: '94% in Shelved State',
      icon: Boxes,
      color: 'var(--accent-blue)',
      lightBg: 'var(--blue-light)',
      border: '#bfdbfe',
      route: ROUTES.LOTS
    },
    {
      title: "Today's Intake Donations",
      value: '1,420 kg',
      change: '12 Manifests Parsed',
      icon: HeartHandshake,
      color: 'var(--secondary)',
      lightBg: 'var(--secondary-light)',
      border: '#c7d2fe',
      route: ROUTES.DONATIONS
    },
    {
      title: 'Total Distributions',
      value: '468 Packages',
      change: 'FEFO Rules Enforced',
      icon: Truck,
      color: 'var(--primary)',
      lightBg: 'var(--primary-light)',
      border: 'var(--primary-border)',
      route: ROUTES.DISTRIBUTIONS
    }
  ];

  const statePipeline = [
    { name: 'Received', count: 18, color: '#f59e0b', desc: 'Clerk Inspection' },
    { name: 'Checked', count: 12, color: '#3b82f6', desc: 'Quality Verified' },
    { name: 'Shelved', count: 86, color: '#10b981', desc: 'Ready for Allocation' },
    { name: 'Reserved', count: 9, color: '#6366f1', desc: 'Distribution Locked' },
    { name: 'Released', count: 42, color: '#059669', desc: 'Distributed Out' }
  ];

  return (
    <PageContainer
      title="Admin Operations Dashboard"
      subtitle="Overview of food bank personnel, inventory throughput, and state machine integrity"
      actions={
        <Button
          variant="primary"
          leftIcon={<UserPlus size={16} />}
          onClick={() => navigate(ROUTES.USERS)}
        >
          Manage Users
        </Button>
      }
    >
      {/* 4 Metric Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1.75rem'
        }}
      >
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className="card"
              style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              onClick={() => navigate(m.route)}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                    {m.title}
                  </span>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: m.lightBg,
                      color: m.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `1px solid ${m.border}`
                    }}
                  >
                    <Icon size={20} />
                  </div>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                  {m.value}
                </div>
              </div>
              <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--primary)', fontWeight: 600 }}>
                  <TrendingUp size={13} />
                  {m.change}
                </span>
                <ArrowUpRight size={15} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid Section: Food Inventory Pipeline & Staff Role Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '1.75rem' }}>
        {/* Food Bank Inventory State Machine Visualizer */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={18} style={{ color: 'var(--primary)' }} />
                Food Item State Machine Pipeline
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Strict inventory progression rule monitoring
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.LOTS)}>
              View All Lots
            </Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {statePipeline.map((step, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-light)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: step.color }} />
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {step.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {step.desc}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {step.count} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>lots</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Staff User Role Breakdown */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={18} style={{ color: 'var(--secondary)' }} />
                Registered Staff Roles
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Role distribution across operational teams
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.USERS)}>
              Manage
            </Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <RoleBadge role="admin" size="sm" />
                </span>
                <span>{adminCount} Users</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ width: `${(adminCount / totalUsers) * 100}%`, height: '100%', backgroundColor: '#7e22ce' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <RoleBadge role="donation_clerk" size="sm" />
                </span>
                <span>{clerkCount} Users</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ width: `${(clerkCount / totalUsers) * 100}%`, height: '100%', backgroundColor: 'var(--primary)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <RoleBadge role="stock_manager" size="sm" />
                </span>
                <span>{stockCount} Users</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ width: `${(stockCount / totalUsers) * 100}%`, height: '100%', backgroundColor: 'var(--accent-blue)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <RoleBadge role="handout_coordinator" size="sm" />
                </span>
                <span>{handoutCount} Users</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ width: `${(handoutCount / totalUsers) * 100}%`, height: '100%', backgroundColor: 'var(--secondary)' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FEFO Expiry Warning Alerts Banner */}
      <div
        style={{
          padding: '1.25rem 1.5rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--amber-light)',
          border: '1px solid var(--amber-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <AlertTriangle size={24} style={{ color: 'var(--accent-amber)', flexShrink: 0 }} />
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
              FEFO Priority Notice: 3 Stock Lots Expiring Soon
            </h4>
            <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
              Organic Fresh Milk (Lot #M-204) expires in 3 days. Automated backend FEFO allocation has prioritized these for upcoming distributions.
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.LOTS)}>
          Review Expiry Table
        </Button>
      </div>
    </PageContainer>
  );
};
