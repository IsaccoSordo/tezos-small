import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  type AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import {
  BLOCK_LEVEL_PATTERN,
  TEZOS_ADDRESS_PATTERN,
} from '../../config/search.config';
import type { SearchResult } from '../../models';
import { Store } from '../../store/tzkt.store';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  standalone: true,
  imports: [FormsModule, AutoCompleteModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
  private router = inject(Router);
  private store = inject(Store);

  searchQuery = '';
  suggestions = this.store.searchSuggestions;

  onSearch(event: AutoCompleteCompleteEvent): void {
    this.store.searchAccounts(event.query.trim());
  }

  onSelect(result: SearchResult): void {
    const route = result.type === 'block' ? '/details' : '/account';
    this.router.navigate([route, result.value]);
    this.searchQuery = '';
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'Enter') {
      return;
    }

    const query = this.searchQuery.trim();

    if (this.isBlockLevel(query)) {
      this.router.navigate(['/details', query]);
      this.searchQuery = '';
      return;
    }

    if (this.isAddress(query)) {
      this.router.navigate(['/account', query]);
      this.searchQuery = '';
    }
  }

  private isBlockLevel(query: string): boolean {
    return BLOCK_LEVEL_PATTERN.test(query);
  }

  private isAddress(query: string): boolean {
    return TEZOS_ADDRESS_PATTERN.test(query);
  }
}
