import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { AuthState, User } from './auth.interfaces';
import { AUTH_STORAGE_KEYS } from '../config/auth.config';

function loadInitialState(): AuthState {
  if (typeof window === 'undefined') {
    return {
      user: null,
      token: null,
      isAuthenticated: false,
    };
  }

  const storedToken = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
  const storedUser = localStorage.getItem(AUTH_STORAGE_KEYS.USER);

  if (storedToken && storedUser) {
    try {
      return {
        token: storedToken,
        user: JSON.parse(storedUser) as User,
        isAuthenticated: true,
      };
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
      localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
    }
  }

  return {
    user: null,
    token: null,
    isAuthenticated: false,
  };
}

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState<AuthState>(loadInitialState()),
  withMethods((store) => ({
    setAuth(user: User, token: string): void {
      localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user));

      patchState(store, {
        user,
        token,
        isAuthenticated: true,
      });
    },

    clearAuth(): void {
      localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
      localStorage.removeItem(AUTH_STORAGE_KEYS.USER);

      patchState(store, {
        user: null,
        token: null,
        isAuthenticated: false,
      });
    },

    resetState(): void {
      localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
      localStorage.removeItem(AUTH_STORAGE_KEYS.USER);

      patchState(store, {
        user: null,
        token: null,
        isAuthenticated: false,
      });
    },
  }))
);
