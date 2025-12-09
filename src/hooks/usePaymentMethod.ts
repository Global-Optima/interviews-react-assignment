import { useEffect, useState } from 'react';

export function usePaymentMethod() {
  const [paymentData, setPaymentData] = useState({
    method: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVV: '',
  });
  const [paymentErrors, setPaymentErrors] = useState({
    method: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVV: '',
  });

  // Load payment data
  useEffect(() => {
    const savedPayment = localStorage.getItem('checkout_payment');
    if (savedPayment) {
      try {
        const parsed = JSON.parse(savedPayment);
        // Don't restore sensitive card data for security
        setPaymentData({
          ...parsed,
          cardNumber: '',
          cardExpiry: '',
          cardCVV: '',
        });
      } catch (e) {
        console.error('Failed to load payment data');
      }
    }
  }, []);

  // Save payment data
  useEffect(() => {
    if (paymentData.method) {
      localStorage.setItem(
        'checkout_payment',
        JSON.stringify({
          method: paymentData.method,
        })
      );
    }
  }, [paymentData]);

  const handlePaymentChange = (
    field: keyof typeof paymentData,
    value: string
  ) => {
    setPaymentData((prev) => ({ ...prev, [field]: value }));
    if (paymentErrors[field]) {
      setPaymentErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validatePaymentForm = () => {
    const errors = {} as typeof paymentErrors;

    if (!paymentData.method) {
      errors.method = 'Please select a payment method';
    }

    if (paymentData.method === 'credit_card') {
      if (!paymentData.cardNumber.trim()) {
        errors.cardNumber = 'Card number is required';
      } else if (paymentData.cardNumber.replace(/\s/g, '').length !== 16) {
        errors.cardNumber = 'Card number must be 16 digits';
      }

      if (!paymentData.cardExpiry.trim()) {
        errors.cardExpiry = 'Expiry date is required';
      } else if (!/^\d{2}\/\d{2}$/.test(paymentData.cardExpiry)) {
        errors.cardExpiry = 'Invalid format (MM/YY)';
      } else {
        const [month, year] = paymentData.cardExpiry.split('/').map(Number);
        if (month < 1 || month > 12) {
          errors.cardExpiry = 'Invalid month';
        } else {
          const currentDate = new Date();
          const currentYear = currentDate.getFullYear() % 100;
          const currentMonth = currentDate.getMonth() + 1;
          if (
            year < currentYear ||
            (year === currentYear && month < currentMonth)
          ) {
            errors.cardExpiry = 'Card has expired';
          }
        }
      }

      if (!paymentData.cardCVV.trim()) {
        errors.cardCVV = 'CVV is required';
      } else if (paymentData.cardCVV.length < 3) {
        errors.cardCVV = 'CVV must be 3-4 digits';
      }
    }

    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return {
    paymentData,
    paymentErrors,
    handlePaymentChange,
    validatePaymentForm,
  };
}
