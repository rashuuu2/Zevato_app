export const formatCurrency = (amount: number): string => {
  if (isNaN(amount)) return '₹0';
  return `₹${amount.toLocaleString('en-IN')}`;
};

export default formatCurrency;
