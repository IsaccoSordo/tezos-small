import { Injectable, inject, signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, from, throwError } from 'rxjs';
import {
  map,
  catchError,
  switchMap,
  filter,
  take,
  first,
} from 'rxjs/operators';
import {
  Auth,
  user,
  idToken,
  signInWithPopup,
  signOut,
  linkWithCredential,
  GoogleAuthProvider,
  GithubAuthProvider,
  User as FirebaseUser,
  AuthCredential,
} from '@angular/fire/auth';
import { User } from '../models';

export interface PendingLinkCredential {
  credential: AuthCredential;
  existingProvider: 'google' | 'github';
  existingProviderName: string;
}

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);

  private user$ = user(this.auth);
  private firebaseUser = toSignal(this.user$);

  readonly token = toSignal(idToken(this.auth));

  readonly user = computed(() =>
    this.firebaseUser() ? this.mapFirebaseUser(this.firebaseUser()!) : null
  );

  readonly isAuthenticated = computed(() => !!this.firebaseUser());

  readonly pendingLink = signal<PendingLinkCredential | null>(null);

  /** Waits for Firebase auth to initialize and returns auth status */
  waitForAuthReady(): Observable<boolean> {
    return this.user$.pipe(
      first(),
      map((user) => !!user)
    );
  }

  login(provider = 'google'): Observable<User> {
    const authProvider =
      provider === 'github' ? githubProvider : googleProvider;

    return from(signInWithPopup(this.auth, authProvider)).pipe(
      switchMap((result) =>
        this.user$.pipe(
          filter(
            (user): user is FirebaseUser =>
              !!user && user.uid === result.user.uid
          ),
          take(1),
          map(() => this.mapFirebaseUser(result.user))
        )
      ),
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

    const existingProvider =
      attemptedProvider === 'github' ? 'google' : 'github';
    const existingProviderName =
      attemptedProvider === 'github' ? 'Google' : 'GitHub';

    this.pendingLink.set({
      credential,
      existingProvider: existingProvider as 'google' | 'github',
      existingProviderName,
    });

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
          switchMap(() =>
            this.user$.pipe(
              filter(
                (user): user is FirebaseUser =>
                  !!user && user.uid === result.user.uid
              ),
              take(1),
              map(() => {
                this.pendingLink.set(null);
                return this.mapFirebaseUser(result.user);
              })
            )
          )
        )
      ),
      catchError((err) => {
        this.pendingLink.set(null);
        throw err;
      })
    );
  }

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
    return from(signOut(this.auth));
  }
}
