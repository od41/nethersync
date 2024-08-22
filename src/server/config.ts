export const APILLION_KEY_SECRET = process.env.APILLION_KEY_SECRET!;
export const APILLION_API_KEY = process.env.APILLION_API_KEY!;

export const AUTH_SECRET = process.env.AUTH_SECRET!;

export const BASE_URL = process.env.BASE_URL!;

// financial variables
export const NETHERSYNC_FEES_WALLET_ADDRESS =
  process.env.NETHERSYNC_FEES_WALLET_ADDRESS!;
//  0.0001 (0.01%) to 1.0 (100%) and must add up to 1.00 (100%).
// https://docs.cryptapi.io/#operation/create
export const NS_FEES_PERCENTAGE = process.env.NS_FEES_PERCENTAGE!; // TEN PERCENT
export const MINIMUM_AMOUNT_USD = process.env.MINIMUM_AMOUNT_USD!;

// email variables
export const RESEND_API_KEY = process.env.RESEND_API_KEY!;

// firebase variables
export const FIREBASE_ADMIN_PROJECT_ID = process.env.FIREBASE_ADMIN_PROJECT_ID!;
export const FIREBASE_ADMIN_CLIENT_EMAIL = process.env.FIREBASE_ADMIN_CLIENT_EMAIL!;
export const FIREBASE_ADMIN_PRIVATE_KEY = process.env.FIREBASE_ADMIN_PRIVATE_KEY!;
