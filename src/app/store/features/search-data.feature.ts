import { inject } from '@angular/core';
import {
  signalStoreFeature,
  withMethods,
  patchState,
  type,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, of, tap, filter, debounceTime } from 'rxjs';
import { TZKTState, SearchResult } from '../../models';
import { SearchService } from '../../services/search.service';
import {
  MIN_SEARCH_LENGTH,
  SEARCH_DEBOUNCE_MS,
  BLOCK_LEVEL_PATTERN,
  TEZOS_ADDRESS_PATTERN,
} from '../../config/search.config';

function isBlockLevel(query: string): boolean {
  return BLOCK_LEVEL_PATTERN.test(query);
}

function isAddress(query: string): boolean {
  return TEZOS_ADDRESS_PATTERN.test(query);
}

function buildLocalResults(query: string): SearchResult[] {
  const results: SearchResult[] = [];

  if (isBlockLevel(query)) {
    results.push({
      type: 'block',
      label: `Block ${query}`,
      value: query,
    });
  }

  if (isAddress(query)) {
    results.push({
      type: 'account',
      label: query,
      value: query,
    });
  }

  return results;
}

export function withSearchData() {
  return signalStoreFeature(
    { state: type<TZKTState>() },
    withMethods((store, searchService = inject(SearchService)) => ({
      searchAccounts: rxMethod<string>(
        pipe(
          debounceTime(SEARCH_DEBOUNCE_MS),
          filter((query) => query.trim().length >= MIN_SEARCH_LENGTH),
          switchMap((query) => {
            const trimmedQuery = query.trim();
            const localResults = buildLocalResults(trimmedQuery);

            if (isAddress(trimmedQuery)) {
              return of(localResults);
            }

            return searchService.suggestAccounts(trimmedQuery).pipe(
              switchMap((accounts) => {
                const accountResults: SearchResult[] = accounts.map((acc) => ({
                  type: 'account' as const,
                  label: acc.alias || acc.address,
                  value: acc.address,
                }));
                return of([...localResults, ...accountResults]);
              })
            );
          }),
          tap((suggestions) =>
            patchState(store, { searchSuggestions: suggestions })
          )
        )
      ),
    }))
  );
}
