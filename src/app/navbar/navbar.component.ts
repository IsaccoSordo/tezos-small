import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
  DestroyRef,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, switchMap } from 'rxjs';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  template: `
    <div class="navbar-container">
      <p-menubar>
        <ng-template pTemplate="start">
          <a routerLink="" class="brand-link">
            <i
              class="pi pi-box"
              style="font-size: 1.5rem; margin-right: 0.5rem;"
            ></i>
            <span class="brand-text">TezosSmall</span>
          </a>
        </ng-template>
        <ng-template pTemplate="end">
          @if (authService.isAuthenticated()) {
            <div class="user-section">
              <p-avatar
                [image]="authService.user()?.avatar"
                shape="circle"
                size="normal"
              />
              <span class="user-name">{{ authService.user()?.name }}</span>
              <p-button
                icon="pi pi-sign-out"
                [text]="true"
                severity="secondary"
                (onClick)="logout()"
                pTooltip="Sign out"
              />
            </div>
          } @else {
            <p-button
              label="Sign In"
              icon="pi pi-sign-in"
              [text]="true"
              (onClick)="navigateToLogin()"
            />
          }
        </ng-template>
      </p-menubar>
    </div>
  `,
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    MenubarModule,
    ButtonModule,
    AvatarModule,
    TooltipModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit {
  authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private logoutTrigger$ = new Subject<void>();

  ngOnInit(): void {
    this.logoutTrigger$
      .pipe(
        switchMap(() => this.authService.logout()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.logoutTrigger$.next();
  }
}
