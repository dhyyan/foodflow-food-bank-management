import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/common/Modal/Modal';
import { Button } from '../../../components/common/Button/Button';
import { Mail, Bell, RefreshCw, CheckCircle, AlertTriangle, Send, ShieldAlert, FileText } from 'lucide-react';
import { formatDate } from '../../../utils/date';
import apiClient from '../../../services/api/apiClient';

interface NotificationLog {
  _id: string;
  type: 'EXPIRY_ALERT_48H' | 'DAILY_INTAKE_SUMMARY';
  recipientEmail: string;
  recipientName: string;
  recipientRole: string;
  subject: string;
  status: 'sent' | 'failed' | 'simulated';
  payloadSummary: string;
  itemCount: number;
  sentAt: string;
}

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose
}) => {
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [triggeringExpiry, setTriggeringExpiry] = useState(false);
  const [triggeringSummary, setTriggeringSummary] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/notifications/history');
      if (res.data && res.data.data) {
        setLogs(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load notification history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  const handleTriggerExpiryAlerts = async () => {
    setTriggeringExpiry(true);
    setFeedbackMsg(null);
    try {
      const res = await apiClient.post('/notifications/expiry-alerts');
      setFeedbackMsg({
        type: 'success',
        message: res.data.message || '48-Hour Expiry Alert emails processed and sent successfully.'
      });
      fetchHistory();
    } catch (err: any) {
      setFeedbackMsg({
        type: 'error',
        message: err.response?.data?.message || err.message || 'Failed to trigger expiry alerts.'
      });
    } finally {
      setTriggeringExpiry(false);
    }
  };

  const handleTriggerDailySummary = async () => {
    setTriggeringSummary(true);
    setFeedbackMsg(null);
    try {
      const res = await apiClient.post('/notifications/daily-summary');
      setFeedbackMsg({
        type: 'success',
        message: res.data.message || 'Daily Intake Summary emails generated and sent successfully.'
      });
      fetchHistory();
    } catch (err: any) {
      setFeedbackMsg({
        type: 'error',
        message: err.response?.data?.message || err.message || 'Failed to trigger daily summary.'
      });
    } finally {
      setTriggeringSummary(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Automated Email Notification Hub" maxWidth="800px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {feedbackMsg && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: feedbackMsg.type === 'success' ? '#ecfdf5' : '#fee2e2',
              border: `1px solid ${feedbackMsg.type === 'success' ? '#a7f3d0' : '#fca5a5'}`,
              color: feedbackMsg.type === 'success' ? '#065f46' : '#991b1b',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {feedbackMsg.type === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
            {feedbackMsg.message}
          </div>
        )}

        {/* Action Trigger Banner */}
        <div
          style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-default)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bell size={18} style={{ color: 'var(--primary)' }} />
              Automated Email Dispatch Triggers
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Send instant automated emails to Stock Managers (48h expiry warnings) & Handout Coordinators (Daily intake summary).
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ShieldAlert size={14} />}
              onClick={handleTriggerExpiryAlerts}
              isLoading={triggeringExpiry}
            >
              Send 48h Expiry Alert
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<FileText size={14} />}
              onClick={handleTriggerDailySummary}
              isLoading={triggeringSummary}
            >
              Send Daily Intake Summary
            </Button>
          </div>
        </div>

        {/* Sent Notification History Table */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Mail size={16} style={{ color: 'var(--primary)' }} />
              Notification Dispatch History ({logs.length})
            </span>
            <Button variant="outline" size="sm" leftIcon={<RefreshCw size={14} />} onClick={fetchHistory} isLoading={loading}>
              Refresh Logs
            </Button>
          </div>

          <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
              <thead style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-default)' }}>
                <tr>
                  <th style={{ padding: '0.6rem 0.8rem' }}>Type</th>
                  <th style={{ padding: '0.6rem 0.8rem' }}>Recipient</th>
                  <th style={{ padding: '0.6rem 0.8rem' }}>Subject & Summary</th>
                  <th style={{ padding: '0.6rem 0.8rem' }}>Sent Timestamp</th>
                  <th style={{ padding: '0.6rem 0.8rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No automated notification logs recorded yet. Trigger a test dispatch above.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '0.6rem 0.8rem' }}>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '0.2rem 0.45rem',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: log.type === 'EXPIRY_ALERT_48H' ? '#fee2e2' : '#ecfdf5',
                            color: log.type === 'EXPIRY_ALERT_48H' ? '#991b1b' : '#065f46'
                          }}
                        >
                          {log.type === 'EXPIRY_ALERT_48H' ? '48H Expiry' : 'Daily Intake'}
                        </span>
                      </td>
                      <td style={{ padding: '0.6rem 0.8rem' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{log.recipientName}</div>
                        <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>{log.recipientEmail}</div>
                      </td>
                      <td style={{ padding: '0.6rem 0.8rem' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{log.subject}</div>
                        <div style={{ fontSize: '0.73rem', color: 'var(--text-subtle)' }}>{log.payloadSummary}</div>
                      </td>
                      <td style={{ padding: '0.6rem 0.8rem', color: 'var(--text-muted)' }}>{formatDate(log.sentAt)}</td>
                      <td style={{ padding: '0.6rem 0.8rem' }}>
                        <span style={{ fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Send size={12} />
                          Sent
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
