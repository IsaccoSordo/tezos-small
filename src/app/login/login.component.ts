import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  type OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { Subject, switchMap } from 'rxjs';
import { OAUTH_PROVIDERS } from '../config/auth.config';
import { AuthService } from '../services/auth.service';

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

    this.loginTrigger$
      .pipe(
        switchMap((provider) => this.authService.login(provider)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.router.navigateByUrl(this.returnUrl);
      });

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
