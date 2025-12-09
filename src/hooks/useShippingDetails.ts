import { useEffect, useState } from 'react';

export function useShippingDetails() {
  const [shippingData, setShippingData] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    deliverySlot: '',
  });
  const [shippingErrors, setShippingErrors] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    deliverySlot: '',
  });

  // Load from storage
  useEffect(() => {
    const savedShipping = localStorage.getItem('checkout_shipping');
    if (savedShipping) {
      try {
        setShippingData(JSON.parse(savedShipping));
      } catch (e) {
        console.error('Failed to load shipping data');
      }
    }
  }, []);

  // Save to storage
  useEffect(() => {
    if (Object.values(shippingData).some((val) => val !== '')) {
      localStorage.setItem('checkout_shipping', JSON.stringify(shippingData));
    }
  }, [shippingData]);

  const handleShippingChange = (
    field: keyof typeof shippingErrors,
    value: string
  ) => {
    setShippingData((prev) => ({ ...prev, [field]: value }));
    if (shippingErrors[field]) {
      setShippingErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateShippingForm = () => {
    const errors = {} as typeof shippingErrors;

    if (!shippingData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    } else if (shippingData.fullName.trim().length < 2) {
      errors.fullName = 'Name must be at least 2 characters';
    }

    if (!shippingData.address.trim()) {
      errors.address = 'Address is required';
    } else if (shippingData.address.trim().length < 5) {
      errors.address =
        'Please enter a complete address. Address must be at least 5 characters';
    }

    if (!shippingData.city.trim()) {
      errors.city = 'City is required';
    }

    if (!shippingData.postalCode.trim()) {
      errors.postalCode = 'Postal code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(shippingData.postalCode)) {
      errors.postalCode =
        'Invalid postal code format (e.g., 12345 or 12345-6789)';
    }

    if (!shippingData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[\d\s\-+()]{10,}$/.test(shippingData.phone)) {
      errors.phone =
        'Invalid phone number format. Phone number should be at least 10 digits';
    }

    if (!shippingData.deliverySlot) {
      errors.deliverySlot = 'Please select a delivery time slot';
    }

    setShippingErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return {
    shippingData,
    shippingErrors,
    handleShippingChange,
    validateShippingForm,
  };
}
