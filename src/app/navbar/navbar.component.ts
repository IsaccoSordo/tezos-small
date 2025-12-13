import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  template: `
    <div class="navbar-container">
      <p-menubar [model]="items">
        <ng-template pTemplate="start">
          <a routerLink="" class="brand-link">
            <i class="pi pi-box" style="font-size: 1.5rem; margin-right: 0.5rem;"></i>
            <span class="brand-text">TezosSmall</span>
          </a>
        </ng-template>
        <ng-template pTemplate="end">
          <i class="pi pi-server" style="font-size: 1.2rem; color: #0d6efd;"></i>
        </ng-template>
      </p-menubar>
    </div>
  `,
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [RouterLink, MenubarModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  items: MenuItem[] = [
    {
      label: 'Blocks',
      icon: 'pi pi-th-large',
      routerLink: '/'
    }
  ];
}
