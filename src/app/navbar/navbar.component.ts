import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  template: ` <nav class="navbar navbar-light bg-light">
    <a class="nav-item nav-link" routerLink="">TezosSmall</a>
  </nav>`,
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {}
