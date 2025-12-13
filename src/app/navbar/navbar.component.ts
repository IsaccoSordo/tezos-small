import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';

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
      </p-menubar>
    </div>
  `,
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [RouterLink, MenubarModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {}
