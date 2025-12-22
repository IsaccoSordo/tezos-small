import {
  Component,
  inject,
  ChangeDetectionStrategy,
  OnInit,
  DestroyRef,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, switchMap, catchError, EMPTY } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../services/auth.service';
import { OAUTH_PROVIDERS } from '../config/auth.config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [ButtonModule, CardModule, MessageModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  providers = OAUTH_PROVIDERS;
  private returnUrl = '/';
  private loginTrigger$ = new Subject<string>();
  private linkTrigger$ = new Subject<void>();

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';

    // Handle regular login
    this.loginTrigger$
      .pipe(
        switchMap((provider) =>
          this.authService.login(provider).pipe(
            catchError((err) => {
              // If linking is required, the error is caught but pendingLink is set
              if (err?.code === 'auth/linking-required') {
                return EMPTY;
              }
              throw err;
            })
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.router.navigateByUrl(this.returnUrl);
      });

    // Handle account linking completion
    this.linkTrigger$
      .pipe(
        switchMap(() => this.authService.completeAccountLinking()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.router.navigateByUrl(this.returnUrl);
      });
  }

  loginWithProvider(provider: string): void {
    this.loginTrigger$.next(provider);
  }

  completeLinking(): void {
    this.linkTrigger$.next();
  }

  cancelLinking(): void {
    this.authService.clearPendingLink();
  }
}
