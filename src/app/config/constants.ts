/**
 * Application-wide constants
 */

// Rate limiting - max concurrent HTTP requests
export const RATE_LIMIT = {
  /** Default concurrency for parallel requests */
  DEFAULT: 3,
  /** Lower concurrency for heavier operations */
  LOW: 2,
  /** Higher concurrency for lightweight operations */
  HIGH: 5,
} as const;

// Pagination defaults
export const PAGINATION = {
  /** Default page size for list views */
  DEFAULT_PAGE_SIZE: 10,
  /** Default starting page (0-indexed) */
  DEFAULT_PAGE: 0,
} as const;

// Polling intervals (milliseconds)
export const POLLING = {
  /** Interval for polling block count */
  BLOCKS_COUNT_MS: 60_000,
} as const;

// Tezos-specific constants
export const TEZOS = {
  /** Tezos currency symbol */
  SYMBOL: 'ꜩ',
  /** Mutez to XTZ conversion factor (1 XTZ = 1,000,000 mutez) */
  MUTEZ_PER_XTZ: 1_000_000,
  /** Contract address prefix */
  CONTRACT_PREFIX: 'KT1',
  /** User address prefixes */
  USER_ADDRESS_PATTERN: /^tz[123]/,
} as const;

// Time constants (milliseconds)
export const TIME = {
  MINUTE_MS: 60_000,
  HOUR_MS: 3_600_000,
  DAY_MS: 86_400_000,
} as const;

// Hash truncation for display
export const HASH_DISPLAY = {
  /** Characters to show from start of hash */
  PREFIX_LENGTH: 8,
  /** Characters to show from end of hash */
  SUFFIX_LENGTH: 6,
} as const;

// Default active tab for account explorer
export const DEFAULT_TAB = 'operations';
