export interface Column {
  field: string;
  header: string;
}

export interface TableData {
  count: number;
  page: number;
  pageSize: number;
}

export interface PageChangeEvent {
  page: number;
  pageSize: number;
}

export type CursorDirection = 'next' | 'prev' | 'first';

export interface CursorNavigateEvent {
  direction: CursorDirection;
  limit: number;
}

export interface TabConfig {
  label: string;
  value: string;
}
