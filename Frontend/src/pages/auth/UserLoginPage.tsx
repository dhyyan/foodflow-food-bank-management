import React, { useState, type FormEvent, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Shield, CheckCircle2, UserCheck } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { loginUser, clearAuthError } from '../../features/auth/authSlice';
import { Input } from '../../components/common/Input/Input';
import { Button } from '../../components/common/Button/Button';
import { ErrorState } from '../../components/common/ErrorState/ErrorState';
import { ROUTES } from '../../constants/routes';
import { getRoleDefaultRoute } from '../../constants/roles';
import { validateEmail, validatePassword } from '../../utils/validation';
import logoImg from '../../assets/876fb4c9ef2542f1c3eceee921a9a9fb.jpg';

export const UserLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string | null; password?: string | null }>({});

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user, loading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      const defaultRoute = getRoleDefaultRoute(user.role);
      navigate(defaultRoute, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    dispatch(clearAuthError());

    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);

    if (emailErr || passwordErr) {
      setErrors({ email: emailErr, password: passwordErr });
      return;
    }

    setErrors({});
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      toast.success(`Welcome back, ${result.payload.user.name || 'Staff'}! Login successful.`);
    } else if (loginUser.rejected.match(result)) {
      toast.error((result.payload as string) || 'Login failed. Please check credentials.');
    }
  };

  const fillCredentials = (userEmail: string, userPass: string) => {
    setEmail(userEmail);
    setPassword(userPass);
    dispatch(clearAuthError());
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }}
    >
      <div
        className="animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border-default)',
          padding: '2.25rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <img
            src={logoImg}
            alt="Food-Flow Logo"
            style={{
              width: '56px',
              height: '56px',
              borderRadius: 'var(--radius-md)',
              objectFit: 'cover',
              border: '1px solid var(--primary-border)',
              marginBottom: '0.85rem'
            }}
          />
          <h1
            style={{
              fontSize: '1.6rem',
              fontWeight: 800,
              color: 'var(--text-main)',
              letterSpacing: '-0.02em',
              margin: '0 0 0.35rem'
            }}
          >
            Food<span style={{ color: 'var(--primary)' }}>Flow</span> Staff Portal
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Sign in with operational staff credentials to access your role-based workstation
          </p>
        </div>

        {/* Global Error Banner */}
        {error && <ErrorState message={error} />}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <Input
            label="Email Address"
            type="email"
            placeholder="user@foodflow.org"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            leftIcon={<Mail size={18} />}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            leftIcon={<Lock size={18} />}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={loading}
            rightIcon={<ArrowRight size={18} />}
            style={{ marginTop: '0.5rem', width: '100%' }}
          >
            Sign In to Staff Workspace
          </Button>
        </form>

        {/* Demo Quick Fill Options */}
        <div
          style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-default)',
            fontSize: '0.8rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}
        >
          <div style={{ fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <UserCheck size={15} style={{ color: 'var(--primary)' }} />
            Demo Staff Accounts (Click to Autofill):
          </div>

          <div
            onClick={() => fillCredentials('clerk@foodflow.org', 'Clerk@123456')}
            style={{
              padding: '0.45rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-default)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.78rem'
            }}
          >
            <div>
              <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>Donation Clerk</span>
              <span style={{ color: 'var(--text-muted)', marginLeft: '0.35rem' }}>(clerk@foodflow.org)</span>
            </div>
            <CheckCircle2 size={14} style={{ color: 'var(--primary)' }} />
          </div>

          <div
            onClick={() => fillCredentials('stock@foodflow.org', 'Stock@123456')}
            style={{
              padding: '0.45rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-default)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.78rem'
            }}
          >
            <div>
              <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>Stock Manager</span>
              <span style={{ color: 'var(--text-muted)', marginLeft: '0.35rem' }}>(stock@foodflow.org)</span>
            </div>
            <CheckCircle2 size={14} style={{ color: 'var(--primary)' }} />
          </div>

          <div
            onClick={() => fillCredentials('handout@foodflow.org', 'Handout@123456')}
            style={{
              padding: '0.45rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-default)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.78rem'
            }}
          >
            <div>
              <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>Handout Coordinator</span>
              <span style={{ color: 'var(--text-muted)', marginLeft: '0.35rem' }}>(handout@foodflow.org)</span>
            </div>
            <CheckCircle2 size={14} style={{ color: 'var(--primary)' }} />
          </div>
        </div>

        {/* Portal Switcher Footer */}
        <div style={{ textAlign: 'center', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
          System Administrator?{' '}
          <Link
            to={ROUTES.ADMIN_LOGIN}
            style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
          >
            <Shield size={14} /> Switch to Admin Portal
          </Link>
        </div>
      </div>
    </div>
  );
};
