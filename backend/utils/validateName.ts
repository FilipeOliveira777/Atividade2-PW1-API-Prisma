export const validateName = (name: string): boolean => {
  if (typeof name !== 'string' || name.trim().length < 3) {
    return false;
  }
  return true;
};
