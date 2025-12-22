/**
 * UI Component Models
 *
 * Interfaces for reusable UI components.
 * Component-specific types should remain co-located with their components.
 */

export interface Column {
  field: string;
  header: string;
}

export interface TableData {
  count: number;
  page: number;
  pageSize: number;
}
