import {
  Component,
  inject,
  ChangeDetectionStrategy,
  OnInit,
  DestroyRef,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, switchMap } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AuthService } from '../auth.service';
import { OAUTH_PROVIDERS } from '../../config/auth.config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [ButtonModule, CardModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  providers = OAUTH_PROVIDERS;
  private loginTrigger$ = new Subject<string>();

  ngOnInit(): void {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';

    this.loginTrigger$
      .pipe(
        switchMap((provider) => this.authService.login(provider)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.router.navigateByUrl(returnUrl);
      });
  }

  loginWithProvider(provider: string): void {
    this.loginTrigger$.next(provider);
  }
}
