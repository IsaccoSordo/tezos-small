import { OAuthProvider } from '../common';

/** Storage keys for auth data */
export const AUTH_STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
} as const;

/** API endpoints that require authentication */
export const PROTECTED_API_PATTERNS = ['/operations/transactions'] as const;

/** OAuth providers configuration */
export const OAUTH_PROVIDERS: Record<string, OAuthProvider> = {
  google: {
    name: 'Google',
    icon: 'pi pi-google',
    color: '#4285f4',
  },
  github: {
    name: 'GitHub',
    icon: 'pi pi-github',
    color: '#333',
  },
} as const;

/** Mock delay for simulating OAuth flow (ms) */
export const MOCK_AUTH_DELAY = 1000;
