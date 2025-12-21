import { Injectable, inject } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { AuthStore } from '../store/auth.store';
import { User } from '../common';
import {
  getFirebaseAuth,
  googleProvider,
  githubProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  FirebaseUser,
} from '../config/firebase.config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authStore = inject(AuthStore);
  private auth = getFirebaseAuth();

  readonly user = this.authStore.user;
  readonly token = this.authStore.token;
  readonly isAuthenticated = this.authStore.isAuthenticated;

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

  login(provider: string = 'google'): Observable<User> {
    const authProvider =
      provider === 'github' ? githubProvider : googleProvider;

    return from(signInWithPopup(this.auth, authProvider)).pipe(
      map((result) => {
        const firebaseUser = result.user;
        return {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          avatar:
            firebaseUser.photoURL ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`,
        };
      })
    );
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
