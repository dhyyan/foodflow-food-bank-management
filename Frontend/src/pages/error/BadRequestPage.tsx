import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertOctagon, Home, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/common/Button/Button';
import { ROUTES } from '../../constants/routes';

interface BadRequestPageProps {
  message?: string;
}

export const BadRequestPage: React.FC<BadRequestPageProps> = ({ message }) => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-main, #f8fafc)',
        padding: '2rem 1.5rem',
        textAlign: 'center'
      }}
    >
      <div
        style={{
          maxWidth: '520px',
          width: '100%',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg, 12px)',
          padding: '3rem 2rem',
          boxShadow: 'var(--shadow-lg, 0 10px 15px -3px rgba(0,0,0,0.1))',
          border: '1px solid var(--border-default, #e2e8f0)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {/* Graphic Icon Badge */}
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'var(--amber-light, #fffbeb)',
            border: '1px solid var(--amber-border, #fde68a)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-amber, #d97706)',
            marginBottom: '1.5rem'
          }}
        >
          <AlertOctagon size={42} />
        </div>

        <div
          style={{
            fontSize: '0.85rem',
            fontWeight: 800,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--accent-amber, #d97706)',
            marginBottom: '0.5rem'
          }}
        >
          Error 400 — Bad Request
        </div>

        <h1
          style={{
            fontSize: '1.85rem',
            fontWeight: 800,
            color: 'var(--text-main, #0f172a)',
            marginBottom: '0.75rem',
            lineHeight: 1.2
          }}
        >
          Invalid Request Submitted
        </h1>

        <p
          style={{
            fontSize: '0.95rem',
            color: 'var(--text-muted, #64748b)',
            lineHeight: 1.5,
            marginBottom: '2rem'
          }}
        >
          {message ||
            'The request parameters or state transition payload submitted were invalid or conflicted with backend food safety rules.'}
        </p>

        {/* Quick Action Navigation */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
          <Button
            variant="outline"
            leftIcon={<ArrowLeft size={16} />}
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>

          <Button
            variant="primary"
            leftIcon={<Home size={16} />}
            onClick={() => navigate(ROUTES.DASHBOARD)}
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};
