/**
 * Vitest Test Setup
 *
 * This file runs before each test file to set up the test environment.
 */

// Mock window.matchMedia for PrimeNG components that use media queries
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
