export interface AccountSuggestion {
  alias: string;
  address: string;
}

export type SearchResultType = 'block' | 'contract' | 'user';

export interface SearchResult {
  type: SearchResultType;
  label: string;
  value: string;
}
