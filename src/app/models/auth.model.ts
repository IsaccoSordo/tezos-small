/**
 * Authentication Domain Models
 *
 * Interfaces for user authentication and OAuth.
 */

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface OAuthProvider {
  name: string;
  icon: string;
  color: string;
}

export interface OAuthCallbackResponse {
  accessToken: string;
  user: User;
  expiresIn: number;
}

/**
 * State interface for Auth SignalStore.
 * Defines the shape of authentication-related state.
 */
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
