export interface AccountSuggestion {
  alias: string;
  address: string;
}

export type SearchResultType = 'account' | 'block';

export interface SearchResult {
  type: SearchResultType;
  label: string;
  value: string;
}
