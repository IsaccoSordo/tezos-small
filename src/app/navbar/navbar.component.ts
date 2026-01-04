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
import { SearchComponent } from '../ui/search/search.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    MenubarModule,
    ButtonModule,
    AvatarModule,
    TooltipModule,
    SearchComponent,
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
