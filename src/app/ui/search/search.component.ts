import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  DestroyRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AutoCompleteModule, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { debounceTime, Subject, switchMap, of, catchError } from 'rxjs';
import { SearchService } from '../../services/search.service';
import { SearchResult } from '../../models';

const MIN_SEARCH_LENGTH = 2;
const DEBOUNCE_MS = 300;

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
  private searchService = inject(SearchService);
  private destroyRef = inject(DestroyRef);

  searchQuery = '';
  suggestions = signal<SearchResult[]>([]);

  private searchTrigger$ = new Subject<string>();

  constructor() {
    this.searchTrigger$
      .pipe(
        debounceTime(DEBOUNCE_MS),
        switchMap((query) => this.search(query)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((results) => {
        this.suggestions.set(results);
      });
  }

  onSearch(event: AutoCompleteCompleteEvent): void {
    const query = event.query.trim();
    if (query.length < MIN_SEARCH_LENGTH) {
      this.suggestions.set([]);
      return;
    }
    this.searchTrigger$.next(query);
  }

  onSelect(result: SearchResult): void {
    if (result.type === 'block') {
      this.router.navigate(['/details', result.value]);
    } else {
      this.router.navigate(['/account', result.value]);
    }
    this.searchQuery = '';
    this.suggestions.set([]);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      const query = this.searchQuery.trim();
      if (this.isBlockLevel(query)) {
        this.router.navigate(['/details', query]);
        this.searchQuery = '';
      } else if (this.isAddress(query)) {
        this.router.navigate(['/account', query]);
        this.searchQuery = '';
      }
    }
  }

  private search(query: string) {
    const results: SearchResult[] = [];

    if (this.isBlockLevel(query)) {
      results.push({
        type: 'block',
        label: `Block ${query}`,
        value: query,
      });
    }

    if (this.isAddress(query)) {
      results.push({
        type: 'account',
        label: query,
        value: query,
      });
      return of(results);
    }

    return this.searchService.suggestAccounts(query).pipe(
      switchMap((accounts) => {
        const accountResults: SearchResult[] = accounts.map((acc) => ({
          type: 'account' as const,
          label: acc.alias || acc.address,
          value: acc.address,
        }));
        return of([...results, ...accountResults]);
      }),
      catchError(() => of(results))
    );
  }

  private isBlockLevel(query: string): boolean {
    return /^\d+$/.test(query);
  }

  private isAddress(query: string): boolean {
    return /^(tz[123]|KT1)[a-zA-Z0-9]{33}$/.test(query);
  }
}
