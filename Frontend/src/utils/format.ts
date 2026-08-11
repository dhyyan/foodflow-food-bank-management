export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const truncate = (text: string, length: number = 30): string => {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};
