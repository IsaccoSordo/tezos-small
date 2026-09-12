import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { SearchComponent } from '../ui/search/search.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [RouterLink, MenubarModule, SearchComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {}
