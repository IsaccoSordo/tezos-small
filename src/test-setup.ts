/**
 * Vitest Test Setup
 *
 * This file runs before each test file to set up the test environment.
 */

// Mock window.matchMedia for PrimeNG components that use media queries
const noop = (): void => {
  // Intentionally empty - required for matchMedia mock
};

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: noop,
    removeListener: noop,
    addEventListener: noop,
    removeEventListener: noop,
    dispatchEvent: () => false,
  }),
});
