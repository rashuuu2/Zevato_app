export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const isValidPhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  return cleanPhone.length >= 10;
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

export const isNotEmpty = (val?: string): boolean => {
  return typeof val === 'string' && val.trim().length > 0;
};
