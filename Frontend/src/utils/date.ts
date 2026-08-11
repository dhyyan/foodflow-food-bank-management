export const formatDate = (dateString?: string | Date): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid Date';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (dateString?: string | Date): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid Date';
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getDaysUntilExpiry = (expiryDate: string | Date): number => {
  const exp = new Date(expiryDate);
  const now = new Date();
  const diffTime = exp.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const isExpired = (expiryDate: string | Date): boolean => {
  return getDaysUntilExpiry(expiryDate) <= 0;
};
