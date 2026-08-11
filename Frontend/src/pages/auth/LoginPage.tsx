import React, { useState, type FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { loginUser, clearAuthError } from '../../features/auth/authSlice';
import { Input } from '../../components/common/Input/Input';
import { Button } from '../../components/common/Button/Button';
import { ErrorState } from '../../components/common/ErrorState/ErrorState';
import { ROUTES } from '../../constants/routes';
import { validateEmail, validatePassword } from '../../utils/validation';
import logoImg from '../../assets/876fb4c9ef2542f1c3eceee921a9a9fb.jpg';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@foodflow.org');
  const [password, setPassword] = useState('Admin@123456');
  const [errors, setErrors] = useState<{ email?: string | null; password?: string | null }>({});

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [isAuthenticated, navigate]);

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
    dispatch(loginUser({ email, password }));
  };

  const fillQuickCredentials = (userEmail: string, userPass: string) => {
    setEmail(userEmail);
    setPassword(userPass);
    dispatch(clearAuthError());
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }}
    >
      <div
        className="animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '440px',
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
        {/* Brand Header */}
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
            Food<span style={{ color: 'var(--primary)' }}>Flow</span> Admin Portal
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Sign in with administrator credentials to manage food bank operations
          </p>
        </div>

        {/* Global Error Banner */}
        {error && <ErrorState message={error} />}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <Input
            label="Email Address"
            type="email"
            placeholder="admin@foodbank.org"
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
            Sign In to Dashboard
          </Button>
        </form>

        {/* Quick Demo Credentials Assistant */}
        <div
          style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-default)',
            fontSize: '0.8rem'
          }}
        >
          <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ShieldCheck size={15} style={{ color: 'var(--primary)' }} />
            Demo Seed Admin Credentials:
          </div>
          <div
            onClick={() => fillQuickCredentials('admin@foodflow.org', 'Admin@123456')}
            style={{
              padding: '0.45rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-default)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: 'var(--text-main)',
              fontWeight: 600,
              fontSize: '0.78rem'
            }}
          >
            <span>admin@foodflow.org / Admin@123456</span>
            <CheckCircle2 size={14} style={{ color: 'var(--primary)' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
