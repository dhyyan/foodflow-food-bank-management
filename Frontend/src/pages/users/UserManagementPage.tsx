import React, { useEffect, useState, type FormEvent } from 'react';
import { UserPlus, Search, ShieldCheck, Mail, User as UserIcon, Lock } from 'lucide-react';
import { toast } from 'react-toastify';
import { PageContainer } from '../../components/layout/PageContainer/PageContainer';
import { Table, type Column } from '../../components/common/Table/Table';
import { Button } from '../../components/common/Button/Button';
import { Input } from '../../components/common/Input/Input';
import { Select } from '../../components/common/Select/Select';
import { Modal } from '../../components/common/Modal/Modal';
import { StatusBadge } from '../../components/shared/StatusBadge/StatusBadge';
import { RoleBadge } from '../../components/shared/RoleBadge/RoleBadge';
import { ErrorState } from '../../components/common/ErrorState/ErrorState';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchUsers, registerUser, resetUserActionState } from '../../features/users/userSlice';
import type { User, RegisterUserDto } from '../../types/user';
import { ROLES, type UserRoleType } from '../../constants/roles';
import { formatDate } from '../../utils/date';
import { validateEmail, validatePassword, validateRequired } from '../../utils/validation';

export const UserManagementPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, loading, actionLoading, error, actionSuccess } = useAppSelector((state) => state.users);

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<RegisterUserDto>({
    name: '',
    email: '',
    password: '',
    role: ROLES.DONATION_CLERK
  });
  const [formErrors, setFormErrors] = useState<Record<string, string | null>>({});

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (actionSuccess) {
      toast.success('Staff user registered successfully!');
      setIsModalOpen(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: ROLES.DONATION_CLERK
      });
      setFormErrors({});
      dispatch(resetUserActionState());
      dispatch(fetchUsers());
    }
  }, [actionSuccess, dispatch]);

  const handleOpenModal = () => {
    dispatch(resetUserActionState());
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    dispatch(resetUserActionState());
  };

  const handleRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const nameErr = validateRequired(formData.name, 'Full Name');
    const emailErr = validateEmail(formData.email);
    const passwordErr = validatePassword(formData.password);

    if (nameErr || emailErr || passwordErr) {
      setFormErrors({ name: nameErr, email: emailErr, password: passwordErr });
      return;
    }

    setFormErrors({});
    const result = await dispatch(registerUser(formData));
    if (registerUser.rejected.match(result)) {
      toast.error((result.payload as string) || 'Failed to register staff user');
    }
  };

  // Filtered User list
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || u.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const columns: Column<User>[] = [
    {
      header: 'Staff Member',
      render: (u) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-default)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              color: 'var(--primary)',
              fontSize: '0.9rem'
            }}
          >
            {u.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{u.name}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{u.email}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Assigned Role',
      render: (u) => <RoleBadge role={u.role} />
    },
    {
      header: 'Account Status',
      render: (u) => <StatusBadge status={u.isActive ? 'active' : 'inactive'} />
    },
    {
      header: 'Registration Date',
      render: (u) => (
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          {formatDate(u.createdAt)}
        </span>
      )
    }
  ];

  return (
    <PageContainer
      title="Staff User Management"
      subtitle="View, manage, and provision role-based access for food bank team members"
      actions={
        <Button variant="primary" leftIcon={<UserPlus size={16} />} onClick={handleOpenModal}>
          Register Staff Member
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
            placeholder="Search staff by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search size={16} />}
          />
        </div>

        <div style={{ width: '220px' }}>
          <Select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            options={[
              { value: 'all', label: 'All Roles' },
              { value: ROLES.ADMIN, label: 'System Admin' },
              { value: ROLES.DONATION_CLERK, label: 'Donation Clerk' },
              { value: ROLES.STOCK_MANAGER, label: 'Stock Manager' },
              { value: ROLES.HANDOUT_COORDINATOR, label: 'Handout Coordinator' }
            ]}
          />
        </div>
      </div>

      {/* Table Display */}
      <Table columns={columns} data={filteredUsers} loading={loading} emptyMessage="No staff members match the selected filters" />

      {/* Registration Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Register New Staff User"
        subtitle="Provision a new user account with role-restricted permissions"
      >
        {error && <ErrorState message={error} />}

        <form noValidate onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem', marginTop: error ? '1rem' : 0 }}>
          <Input
            label="Full Name"
            placeholder="e.g. Sarah Jenkins"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={formErrors.name}
            leftIcon={<UserIcon size={18} />}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="s.jenkins@foodbank.org"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={formErrors.email}
            leftIcon={<Mail size={18} />}
          />

          <Input
            label="Initial Password"
            type="password"
            placeholder="At least 6 characters"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={formErrors.password}
            leftIcon={<Lock size={18} />}
          />

          <Select
            label="Role Assignment"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRoleType })}
            options={[
              { value: ROLES.DONATION_CLERK, label: 'Donation Clerk (Intake & AI Manifest)' },
              { value: ROLES.STOCK_MANAGER, label: 'Stock Manager (Warehouse & FEFO)' },
              { value: ROLES.HANDOUT_COORDINATOR, label: 'Handout Coordinator (Distribution)' },
              { value: ROLES.ADMIN, label: 'System Admin (Full Operational Access)' }
            ]}
          />

          <div
            style={{
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-light)',
              border: '1px solid var(--primary-border)',
              fontSize: '0.8rem',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <ShieldCheck size={16} />
            This registration request is authorized by your Admin session and enforced backend-side.
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={actionLoading}>
              Complete Registration
            </Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
};
