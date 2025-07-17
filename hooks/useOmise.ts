import { useState, useEffect, useCallback } from 'react';
import { loadOmiseScript } from '../utils/scriptLoader';

// Omise's card.js needs a public key. We use a test key for this example.
// In a real application, this should come from environment variables.
const OMISE_PUBLIC_KEY = 'pkey_test_5y1kwe1k7e6wz7x1k2g'; 

// Define the type for the token object that Omise returns on success.
interface OmiseToken {
  object: 'token';
  id: string;
  livemode: boolean;
  location: string;
  used: boolean;
  card: object;
  created_at: string;
}

interface OpenCheckoutOptions {
    amount: number;
    description: string;
    onToken: (token: OmiseToken) => void;
    onFormClosed: () => void;
}

// Custom hook for Omise functionality
export const useOmise = () => {
  const [isOmiseLoaded, setIsOmiseLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOmiseScript()
      .then(() => {
        // Omise's global object might not have perfect TypeScript types, so 'any' is used here.
        (window as any).Omise.configure({
          publicKey: OMISE_PUBLIC_KEY,
          frameLabel: 'Mahabote Astrology',
          submitLabel: 'Pay Now',
          currency: 'thb',
        });
        setIsOmiseLoaded(true);
      })
      .catch((e: Error) => {
        console.error('Failed to load Omise.js:', e);
        setError('Could not initialize the payment system. Please refresh the page.');
      });
  }, []);

  const openCheckout = useCallback(({ amount, description, onToken, onFormClosed }: OpenCheckoutOptions) => {
    if (!isOmiseLoaded || !(window as any).Omise) {
      console.error('Omise is not loaded or configured.');
      setError('Payment system is not ready. Please try again in a moment.');
      onFormClosed(); // Ensure we call the close handler to reset state
      return;
    }
    
    (window as any).Omise.open({
      amount: amount,
      currency: 'THB',
      defaultPaymentMethod: 'credit_card',
      description: description,
      onCreateTokenSuccess: (token: OmiseToken) => {
        onToken(token);
      },
      onFormClosed: () => {
        onFormClosed();
      },
    });
  }, [isOmiseLoaded]);

  return { isOmiseLoaded, error, openCheckout };
};
