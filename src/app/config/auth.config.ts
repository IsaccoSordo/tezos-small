import { OAuthProvider } from '../models';

export const AUTH_STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
} as const;

export const PROTECTED_API_PATTERNS = ['/operations/transactions'] as const;

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
