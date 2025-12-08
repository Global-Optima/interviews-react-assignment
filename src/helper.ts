import { ShippingDetails } from "./Step2ShippingDetails";
export const STORAGE_KEY = "checkout_shipping_details";
export const PHONE_BASE_PREFIX = "87";
export const PHONE_TOTAL_DIGITS = 11;
export const isExpired = (expiry: string): boolean => {
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
    return false;
  }

  const [monthStr, yearStr] = expiry.split("/");

  const expiryYear = 2000 + parseInt(yearStr, 10);
  const expiryMonth = parseInt(monthStr, 10);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (expiryYear < currentYear) {
    return true;
  }
  if (expiryYear === currentYear && expiryMonth < currentMonth) {
    return true;
  }

  return false;
};
export const loadShippingDetails = (): ShippingDetails => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const details = JSON.parse(saved);
      if (!details.phone || details.phone.replace(/\D/g, "").length < 2) {
        details.phone = "8 (7";
      }
      return details;
    } catch (e) {
      console.error("Could not parse shipping details from local storage", e);
    }
  }
  return {
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "8 (7",
    timeSlot: "Morning",
  };
};
export const saveShippingDetails = (details: ShippingDetails) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(details));
};
export const validateShippingDetails = (details: ShippingDetails): boolean => {
  const { fullName, address, city, postalCode, phone, timeSlot } = details;
  const strippedPhone = phone.replace(/\D/g, "");
  const baseValid = !!fullName && !!address && !!city && !!timeSlot;

  const isPostalCodeValid = /^\d{6}$/.test(postalCode);

  const isPhoneValid =
    strippedPhone.length === PHONE_TOTAL_DIGITS &&
    strippedPhone.startsWith(PHONE_BASE_PREFIX);

  return baseValid && isPostalCodeValid && isPhoneValid;
};
