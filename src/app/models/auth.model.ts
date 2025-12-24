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

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
