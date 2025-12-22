import { Injectable, inject, signal } from '@angular/core';
import { Observable, from, of, throwError } from 'rxjs';
import { tap, map, catchError, switchMap } from 'rxjs/operators';
import { AuthStore } from '../store/auth.store';
import { User } from '../models';
import {
  getFirebaseAuth,
  googleProvider,
  githubProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  linkWithCredential,
  FirebaseUser,
  AuthCredential,
} from '../config/firebase.config';
import { GithubAuthProvider, GoogleAuthProvider } from 'firebase/auth';

export interface PendingLinkCredential {
  credential: AuthCredential;
  existingProvider: 'google' | 'github';
  existingProviderName: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authStore = inject(AuthStore);
  private auth = getFirebaseAuth();

  readonly user = this.authStore.user;
  readonly token = this.authStore.token;
  readonly isAuthenticated = this.authStore.isAuthenticated;

  /** Pending credential for account linking (when popup-safe flow is needed) */
  readonly pendingLink = signal<PendingLinkCredential | null>(null);

  constructor() {
    this.initAuthStateListener();
  }

  private initAuthStateListener(): void {
    onAuthStateChanged(this.auth, (firebaseUser) => {
      if (firebaseUser) {
        this.updateUserFromFirebase(firebaseUser);
      } else {
        this.authStore.clearAuth();
      }
    });
  }

  private async updateUserFromFirebase(
    firebaseUser: FirebaseUser
  ): Promise<void> {
    const token = await firebaseUser.getIdToken();
    const user: User = {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || 'User',
      email: firebaseUser.email || '',
      avatar:
        firebaseUser.photoURL ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`,
    };
    this.authStore.setAuth(user, token);
  }

  login(provider = 'google'): Observable<User> {
    const authProvider =
      provider === 'github' ? githubProvider : googleProvider;

    return from(signInWithPopup(this.auth, authProvider)).pipe(
      map((result) => this.mapFirebaseUser(result.user)),
      catchError((error) => this.handleAuthError(error, provider))
    );
  }

  /**
   * Handles auth/account-exists-with-different-credential error
   * by storing pending credential for user-initiated linking.
   * Returns an error observable to signal the UI to show linking prompt.
   */
  private handleAuthError(
    error: {
      code?: string;
      customData?: {
        email?: string;
        _tokenResponse?: { oauthAccessToken?: string };
      };
    },
    attemptedProvider: string
  ): Observable<User> {
    if (error.code !== 'auth/account-exists-with-different-credential') {
      throw error;
    }

    const credential = this.getCredentialFromError(error, attemptedProvider);
    if (!credential) {
      throw error;
    }

    // Store pending credential for user-initiated linking
    const existingProvider =
      attemptedProvider === 'github' ? 'google' : 'github';
    const existingProviderName =
      attemptedProvider === 'github' ? 'Google' : 'GitHub';

    this.pendingLink.set({
      credential,
      existingProvider: existingProvider as 'google' | 'github',
      existingProviderName,
    });

    // Return error to signal UI to show linking prompt
    return throwError(() => ({
      code: 'auth/linking-required',
      message: `Please sign in with ${existingProviderName} to link your accounts.`,
      existingProvider,
      existingProviderName,
    }));
  }

  /**
   * Completes account linking by signing in with existing provider.
   * Must be called from a user-initiated action (button click) to avoid popup blocking.
   */
  completeAccountLinking(): Observable<User> {
    const pending = this.pendingLink();
    if (!pending) {
      return throwError(() => new Error('No pending credential to link'));
    }

    const authProvider =
      pending.existingProvider === 'github' ? githubProvider : googleProvider;

    return from(signInWithPopup(this.auth, authProvider)).pipe(
      switchMap((result) =>
        from(linkWithCredential(result.user, pending.credential)).pipe(
          map(() => {
            console.log('Accounts linked successfully!');
            this.pendingLink.set(null);
            return this.mapFirebaseUser(result.user);
          })
        )
      ),
      catchError((err) => {
        this.pendingLink.set(null);
        throw err;
      })
    );
  }

  /** Clears any pending link credential */
  clearPendingLink(): void {
    this.pendingLink.set(null);
  }

  private getCredentialFromError(
    error: { customData?: { _tokenResponse?: { oauthAccessToken?: string } } },
    provider: string
  ): AuthCredential | null {
    const oauthAccessToken = error.customData?._tokenResponse?.oauthAccessToken;
    if (!oauthAccessToken) return null;

    if (provider === 'github') {
      return GithubAuthProvider.credential(oauthAccessToken);
    }
    return GoogleAuthProvider.credential(null, oauthAccessToken);
  }

  private mapFirebaseUser(firebaseUser: FirebaseUser): User {
    return {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || 'User',
      email: firebaseUser.email || '',
      avatar:
        firebaseUser.photoURL ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`,
    };
  }

  logout(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      tap(() => {
        this.authStore.clearAuth();
      })
    );
  }

  validateSession(): Observable<boolean> {
    const currentUser = this.auth.currentUser;
    return of(!!currentUser);
  }

  refreshToken(): Observable<string> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      return of('');
    }

    return from(currentUser.getIdToken(true));
  }
}
