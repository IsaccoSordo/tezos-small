import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  template: ` <nav class="navbar navbar-light bg-light">
    <a class="nav-item nav-link" routerLink="">TezosSmall</a>
  </nav>`,
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {}
