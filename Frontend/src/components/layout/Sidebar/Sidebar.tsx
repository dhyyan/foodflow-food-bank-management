import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    Users,
    HeartHandshake,
    Boxes,
    Truck,
    LogOut,
    ShieldCheck,
    Bell
} from 'lucide-react';
import { toast } from 'react-toastify';
import { ROUTES } from '../../../constants/routes';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { logout } from '../../../features/auth/authSlice';
import { ROLES, ROLE_LABELS } from '../../../constants/roles';
import { NotificationCenterModal } from '../../../features/notifications/components/NotificationCenterModal';

import logoImg from '../../../assets/876fb4c9ef2542f1c3eceee921a9a9fb.jpg';

export const Sidebar: React.FC = () => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const [isNotificationOpen, setIsNotificationOpen] = React.useState(false);

    const handleLogout = () => {
        dispatch(logout());
        toast.info('Logged out successfully');
    };

    const allNavItems = [
        { label: 'User Management', path: ROUTES.USERS, icon: Users, roles: [ROLES.ADMIN] },
        { label: 'Donation Intake', path: ROUTES.DONATIONS, icon: HeartHandshake, roles: [ROLES.DONATION_CLERK] },
        { label: 'Stock & Lots', path: ROUTES.LOTS, icon: Boxes, roles: [ROLES.STOCK_MANAGER] },
        { label: 'Distributions', path: ROUTES.DISTRIBUTIONS, icon: Truck, roles: [ROLES.HANDOUT_COORDINATOR] }
    ];

    const navItems = allNavItems.filter((item) => user && (item.roles as string[]).includes(user.role));

    return (
        <aside
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                width: 'var(--sidebar-width)',
                backgroundColor: '#ffffff',
                borderRight: '1px solid var(--border-default)',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 100,
                boxShadow: 'var(--shadow-xs)'
            }}
        >
            {/* Brand Header */}
            <div
                style={{
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    borderBottom: '1px solid var(--border-light)'
                }}
            >
                <img
                    src={logoImg}
                    alt="Food-Flow Logo"
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: 'var(--radius-md)',
                        objectFit: 'cover',
                        border: '1px solid var(--primary-border)'
                    }}
                />
                <div>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', margin: 0 }}>
                        Food<span style={{ color: 'var(--primary)' }}>Flow</span>
                    </h2>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {user?.role === ROLES.ADMIN ? 'Admin Portal' : 'Staff Workstation'}
                    </span>
                </div>
            </div>

            {/* Navigation Links */}
            <div style={{ flex: 1, padding: '1.25rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', overflowY: 'auto' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 0.5rem 0.4rem' }}>
                    Core Menu
                </div>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.7rem 0.85rem',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.9rem',
                                fontWeight: isActive ? 700 : 500,
                                color: isActive ? 'var(--primary)' : 'var(--text-main)',
                                backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                                border: isActive ? '1px solid var(--primary-border)' : '1px solid transparent',
                                textDecoration: 'none',
                                transition: 'all 0.15s ease'
                            })}
                        >
                            <Icon size={19} />
                            <span>{item.label}</span>
                        </NavLink>
                    );
                })}
            </div>

            {/* Email Notification Hub Trigger */}
            <div style={{ padding: '0 1rem 0.75rem' }}>
                <button
                    onClick={() => setIsNotificationOpen(true)}
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        padding: '0.65rem 0.85rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        color: '#1e40af',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                    }}
                >
                    <Bell size={18} style={{ color: '#2563eb' }} />
                    <span>Email Notification Hub</span>
                </button>
            </div>

            {/* User Footer Profile */}
            <div
                style={{
                    padding: '1rem',
                    borderTop: '1px solid var(--border-light)',
                    backgroundColor: 'var(--bg-subtle)'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div
                        style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: '#ffffff',
                            border: '1px solid var(--border-default)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            color: 'var(--primary)'
                        }}
                    >
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {user?.name || 'Admin User'}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                            <ShieldCheck size={12} style={{ color: 'var(--primary)' }} />
                            {user?.role ? ROLE_LABELS[user.role] : 'Administrator'}
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: '#ffffff',
                        border: '1px solid var(--border-default)',
                        color: 'var(--accent-red)',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        transition: 'background-color 0.15s ease'
                    }}
                >
                    <LogOut size={15} />
                    Sign Out
                </button>
            </div>

            <NotificationCenterModal
                isOpen={isNotificationOpen}
                onClose={() => setIsNotificationOpen(false)}
            />
        </aside>
    );
};
