/**
 * Discount Code Generation Utilities
 */

/**
 * Generate a random discount code
 * @param prefix - Prefix for the code (e.g., 'WS', 'PROMO', 'REF')
 * @param length - Length of random part (default: 8)
 * @returns Formatted discount code (e.g., 'WS-ABC12345')
 */
export function generateDiscountCode(prefix: string = 'PROMO', length: number = 8): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomPart = '';
  
  for (let i = 0; i < length; i++) {
    randomPart += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return `${prefix}-${randomPart}`;
}

/**
 * Generate a wholesale code
 */
export function generateWholesaleCode(): string {
  return generateDiscountCode('WS', 8);
}

/**
 * Generate a referral code
 */
export function generateReferralCode(userId: string): string {
  // Create a unique referral code based on user ID
  const shortId = userId.substring(0, 8).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `REF-${shortId}${random}`;
}

/**
 * Generate a review reward code
 */
export function generateReviewRewardCode(): string {
  return generateDiscountCode('REVIEW', 6);
}

/**
 * Validate discount code format
 */
export function isValidCodeFormat(code: string): boolean {
  // Check if code matches pattern: PREFIX-XXXXXXXX
  const pattern = /^[A-Z]+-[A-Z0-9]{6,}$/;
  return pattern.test(code);
}

export default {
  generateDiscountCode,
  generateWholesaleCode,
  generateReferralCode,
  generateReviewRewardCode,
  isValidCodeFormat
};
