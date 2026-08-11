export const validateEmail = (email: string): string | null => {
  if (!email.trim()) return 'Email address is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters long';
  return null;
};

export const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value || !value.trim()) return `${fieldName} is required`;
  return null;
};
