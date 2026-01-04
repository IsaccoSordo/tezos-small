import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  DestroyRef,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AutoCompleteModule,
  AutoCompleteCompleteEvent,
} from 'primeng/autocomplete';
import { debounceTime, Subject, switchMap, of, catchError } from 'rxjs';
import { SearchService } from '../../services/search.service';
import { SearchResult } from '../../models';
import {
  MIN_SEARCH_LENGTH,
  SEARCH_DEBOUNCE_MS,
  BLOCK_LEVEL_PATTERN,
  TEZOS_ADDRESS_PATTERN,
} from '../../config/search.config';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  standalone: true,
  imports: [FormsModule, AutoCompleteModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit {
  private router = inject(Router);
  private searchService = inject(SearchService);
  private destroyRef = inject(DestroyRef);

  searchQuery = '';
  suggestions = signal<SearchResult[]>([]);

  private searchTrigger$ = new Subject<string>();

  ngOnInit(): void {
    this.searchTrigger$
      .pipe(
        debounceTime(SEARCH_DEBOUNCE_MS),
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
    const route = result.type === 'block' ? '/details' : '/account';
    this.router.navigate([route, result.value]);
    this.searchQuery = '';
    this.suggestions.set([]);
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
    return BLOCK_LEVEL_PATTERN.test(query);
  }

  private isAddress(query: string): boolean {
    return TEZOS_ADDRESS_PATTERN.test(query);
  }
}
