export const isExpired = (expiry: string): boolean => {
  // Check if the basic format is MM/YY before parsing
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
    return false; // Return false if format is invalid; the regex check will catch this error.
  }

  const [monthStr, yearStr] = expiry.split("/");

  // Convert YY to YYYY (assumes 2000s)
  const expiryYear = 2000 + parseInt(yearStr, 10);
  const expiryMonth = parseInt(monthStr, 10);

  const now = new Date();
  const currentYear = now.getFullYear();
  // Months are 0-indexed in Date (January=0), but expiryMonth is 1-indexed (January=1), so no adjustment needed for comparison.
  const currentMonth = now.getMonth() + 1;

  // 1. Check if the expiry year is in the past
  if (expiryYear < currentYear) {
    return true;
  }

  // 2. If the expiry year is the current year, check if the expiry month is in the past
  if (expiryYear === currentYear && expiryMonth < currentMonth) {
    return true;
  }

  // 3. Otherwise, the card is not expired
  return false;
};
