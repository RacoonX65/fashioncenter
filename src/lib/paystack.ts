/**
 * PayStack Payment Integration for ApparelCast
 * Handles payment initialization and verification
 */

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';
const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '';

export interface PaystackInitializeData {
  email: string;
  amount: number; // in cents (kobo for ZAR)
  reference?: string;
  callback_url?: string;
  metadata?: {
    custom_fields?: Array<{
      display_name: string;
      variable_name: string;
      value: any;
    }>;
    [key: string]: any;
  };
}

export interface PaystackResponse {
  status: boolean;
  message: string;
  data?: any;
}

/**
 * Initialize a PayStack payment
 * Server-side only (uses secret key)
 */
export async function initializePayment(
  data: PaystackInitializeData
): Promise<PaystackResponse> {
  try {
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        amount: Math.round(data.amount * 100), // Convert to kobo (cents)
        reference: data.reference || generateReference(),
        callback_url: data.callback_url,
        metadata: data.metadata,
        currency: 'ZAR',
      }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Payment initialization failed');
    }

    return {
      status: true,
      message: 'Payment initialized successfully',
      data: result.data,
    };
  } catch (error: any) {
    console.error('PayStack initialization error:', error);
    return {
      status: false,
      message: error.message || 'Failed to initialize payment',
    };
  }
}

/**
 * Verify a PayStack payment
 * Server-side only (uses secret key)
 */
export async function verifyPayment(
  reference: string
): Promise<PaystackResponse> {
  try {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Payment verification failed');
    }

    return {
      status: true,
      message: 'Payment verified successfully',
      data: result.data,
    };
  } catch (error: any) {
    console.error('PayStack verification error:', error);
    return {
      status: false,
      message: error.message || 'Failed to verify payment',
    };
  }
}

/**
 * Generate a unique payment reference
 */
export function generateReference(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  return `FC-${timestamp}-${random}`;
}

/**
 * Get PayStack public key for client-side
 */
export function getPublicKey(): string {
  return PAYSTACK_PUBLIC_KEY;
}

/**
 * Client-side payment initialization using PayStack Popup
 * Use this in your checkout component
 */
export interface PaystackPopupOptions {
  email: string;
  amount: number; // in ZAR (will be converted to kobo automatically)
  reference?: string;
  onSuccess: (reference: any) => void;
  onCancel: () => void;
}

export function openPaystackPopup(options: PaystackPopupOptions) {
  // Check if PayStack script is loaded
  if (typeof window === 'undefined' || !(window as any).PaystackPop) {
    console.error('PayStack script not loaded');
    return;
  }

  const handler = (window as any).PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email: options.email,
    amount: Math.round(options.amount * 100), // Convert to kobo
    currency: 'ZAR',
    ref: options.reference || generateReference(),
    callback: function(response: any) {
      options.onSuccess(response);
    },
    onClose: function() {
      options.onCancel();
    },
  });

  handler.openIframe();
}

/**
 * Format amount for display
 */
export function formatAmount(amount: number): string {
  return `R ${amount.toFixed(2)}`;
}

/**
 * Convert kobo (cents) to ZAR
 */
export function koboToZAR(kobo: number): number {
  return kobo / 100;
}

/**
 * Convert ZAR to kobo (cents)
 */
export function zarToKobo(zar: number): number {
  return Math.round(zar * 100);
}

export default {
  initializePayment,
  verifyPayment,
  generateReference,
  getPublicKey,
  openPaystackPopup,
  formatAmount,
  koboToZAR,
  zarToKobo,
};

