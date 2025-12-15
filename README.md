# Tezos Small

[![Angular](https://img.shields.io/badge/Angular-21.0-dd0031?logo=angular)](https://angular.io)
[![NgRx](https://img.shields.io/badge/NgRx-21.0-a907a7?logo=ngrx)](https://ngrx.io/)
[![PrimeNG](https://img.shields.io/badge/PrimeNG-21.0-black?logo=primeng)](https://primeng.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-GPL--3.0-blue)](#license)

An Angular application for exploring Tezos blockchain blocks and transactions through the [TZKT API](https://tzkt.io/api/).

## Features

**Block Explorer**

- Browse Tezos blockchain blocks in a paginated table
- View block details including hash, level, proposer, and timestamp
- Display transaction counts per block

**Transaction Details**

- View individual block transactions
- Display sender, receiver, amount, and transaction status
- Responsive table layout

**Technical Implementation**

- Zoneless change detection (Angular 21)
- Standalone components with signal-based reactivity
- Reactive data flow with RxJS
- HTTP response caching with [@ngneat/cashew](https://github.com/ngneat/cashew)
- Loading states with PrimeNG ProgressSpinner
- Toast notifications for error handling
- PrimeNG Aura theme
- TypeScript strict mode
- SCSS styling

## Quick Start

### Prerequisites

- Node.js: v20.19+ or v22.12+
- npm: v8.0.0 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/IsaccoSordo/tezos-small.git
cd tezos-small

# Install dependencies
npm install
```

### Development Server

```bash
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload when you modify source files.

### Build for Production

```bash
npm run build
```

Build artifacts will be stored in the `dist/tezos-small` directory.

## Testing

The project includes unit tests for components, services, interceptors, and UI elements.

### Prerequisites

Node.js v20.19+ or v22.12+ is required for running tests.

### Run Unit Tests

```bash
npm test                           # Watch mode with auto-reload
npm run test:ci                    # Run once (for CI/automated testing)
npm test -- --coverage             # Generate coverage reports
```

Tests are executed via [Vitest](https://vitest.dev) with jsdom for DOM emulation.

### Testing Patterns

The test suite uses the following patterns:

**Helper Functions**

- Reusable functions for common mock patterns: `initializeComponent()`, `flushCountRequest()`, `flushInitialBlocksRequest()`

**Single Responsibility**

- Each test verifies one specific behavior
- Tests use "should..." naming convention
- Focused assertions for easier debugging

**Test Organization**

- Nested `describe` blocks group related tests
- `beforeEach` sets up test fixtures
- `afterEach` cleans up resources and verifies HTTP mocks

**Async Testing**

- `vi.useFakeTimers()` with `vi.advanceTimersByTime()` for timer-based operations
- `fixture.destroy()` for cleanup of subscriptions
- `HttpTestingController` verifies HTTP interactions

**Example:**

```typescript
describe('MyComponent', () => {
  // Helper functions for common patterns
  const initializeComponent = () => {
    fixture.detectChanges();
    vi.advanceTimersByTime(0); // Handle async timers
  };

  beforeEach(async () => {
    vi.useFakeTimers();
    // Setup common test fixtures
  });

  afterEach(() => {
    fixture.destroy();
    httpMock.verify(); // Ensure no pending requests
    vi.useRealTimers();
  });

  it('should initialize and fetch data', () => {
    initializeComponent();
    flushMockRequests();

    expect(component.data()).toBeTruthy();
  });
});
```

See [blocks-overview.component.spec.ts](src/app/blocks-overview/blocks-overview.component.spec.ts) for complete examples.

## Architecture

### Project Structure

```
src/app/
├── blocks-overview/          # Main blocks listing page
├── details/                  # Transaction details page
├── navbar/                   # Navigation component
├── core/
│   └── global-error.handler.ts # Global error handling
├── interceptors/
│   ├── error.interceptor.ts  # HTTP error handling with toast notifications
│   └── loading.interceptor.ts # HTTP loading state interceptor
├── services/
│   └── tzkt.service.ts      # TZKT API integration
├── store/
│   ├── store.service.ts     # Global state management
│   └── tzkt.state.ts        # Reactive signals for state
├── ui/                       # Reusable UI components
│   ├── spinner/
│   └── table/
├── app.routes.ts            # Application routing
├── app.config.ts            # Global configuration
└── common.ts                # Shared interfaces & types
```

### Key Components

| Component                 | Purpose                                 |
| ------------------------- | --------------------------------------- |
| `BlocksOverviewComponent` | Displays paginated list of blocks       |
| `DetailsComponent`        | Shows transactions for a specific block |
| `NavbarComponent`         | Navigation header with branding         |
| `TableComponent`          | Reusable data table with pagination     |
| `SpinnerComponent`        | Loading indicator                       |

### State Management

The application uses NgRx SignalStore for state management:

```typescript
// Store using NgRx SignalStore with withState and withMethods
export const Store = signalStore(
  { providedIn: 'root' },
  withState<TZKTState>({
    blocks: [],
    count: 0,
    errors: [],
    loadingCounter: 0,
    transactions: [],
  }),
  withMethods((store) => ({
    setBlocks(blocks: Block[]): void {
      patchState(store, { blocks });
    },

    setCount(count: number): void {
      patchState(store, { count });
    },

    incrementLoadingCounter(): void {
      patchState(store, (state) => ({
        loadingCounter: state.loadingCounter + 1,
      }));
    },

    decrementLoadingCounter(): void {
      patchState(store, (state) => ({
        loadingCounter: Math.max(0, state.loadingCounter - 1),
      }));
    },
  }))
);
```

**Key Characteristics:**

- Immutable state updates via `patchState()`
- State properties automatically exposed as signals
- Organized using `withState()` and `withMethods()`
- Full TypeScript support

### HTTP Interceptors

The application uses functional HTTP interceptors (Angular 21+):

**Cache Interceptor** ([@ngneat/cashew](https://github.com/ngneat/cashew))

Provides HTTP response caching:

- Configurable TTL per request via `withCache({ ttl: ms })`
- Automatic cache key generation from URL and params
- Support for localStorage/sessionStorage persistence
- Manual cache invalidation via `HttpCacheManager`

**Error Interceptor**

Provides centralized HTTP error handling:

- Displays toast notifications via PrimeNG `MessageService`
- Extracts error messages from various backend response formats
- Logs errors to console
- Returns EMPTY observable to prevent error propagation to components

**Loading Interceptor**

Manages loading state for HTTP requests:

- Increments counter when requests start
- Decrements counter when requests complete
- Counter-based approach handles concurrent requests

All interceptors are registered globally in [app.config.ts](src/app/app.config.ts).

### API Integration

The `TzktService` handles all blockchain API calls:

- `getBlocksCount()` - Fetch total block count
- `getBlocks(limit, offset)` - Paginated block listing
- `getTransactionsCount(level)` - Get transaction count for a block
- `getTransactions(level)` - Fetch transactions for a block

Loading and error states are managed by HTTP interceptors.

## Development

### Code Scaffolding

Generate new components with Angular CLI:

```bash
ng generate component component-name
ng generate directive|pipe|service|class|guard|interface|enum
```

### Code Style

- OnPush change detection
- Standalone components (no NgModules)
- TypeScript strict mode enabled
- SCSS with BEM naming conventions
- NgRx SignalStore for state management

### RxJS Operators

Key operators used in the application:

- `tap` - Side effects (state updates, logging) without value transformation
- `map` - Transform emitted values
- `catchError` - Handle errors gracefully
- `finalize` - Cleanup logic (e.g., loading state)
- `forkJoin` - Combine multiple async operations

## Dependencies

### Core

- `@angular/*@21.0.5` - Angular framework
- `@ngrx/signals@20.1.0` - NgRx SignalStore for state management
- `@ngneat/cashew` - HTTP response caching
- `rxjs@7.8.2` - Reactive programming
- `typescript@5.9.3` - Type safety

### UI

- `primeng@21.0.1` - Angular UI component library
- `@primeuix/themes@2.0.2` - Theming system
- `primeicons@7.0.0` - Icon library

### Testing

- `vitest@4.0.15` - Test runner
- `jsdom@27.3.0` - DOM emulation for tests

## API Reference

This application uses the [TZKT API](https://tzkt.io/api/) for Tezos blockchain data.

### Base URL

```
https://api.tzkt.io/v1
```

### Endpoints Used

| Endpoint                                 | Description           |
| ---------------------------------------- | --------------------- |
| `/blocks/count`                          | Total block count     |
| `/blocks?limit=X&offset=Y`               | Paginated block list  |
| `/operations/transactions/count?level=X` | Transactions in block |
| `/operations/transactions?level=X`       | Block transactions    |

## Interfaces

### Block

```typescript
interface Block {
  hash: string;
  level: number;
  proposer?: Account;
  timestamp: string;
  transactions: number;
}
```

### Transaction

```typescript
interface Transaction {
  sender: Account;
  target: Account;
  amount: number;
  status: string;
}
```

### Account

```typescript
interface Account {
  alias: string;
  address: string;
}
```

## Configuration

### Environment Setup

Configuration can be found in:

- [tsconfig.json](tsconfig.json) - TypeScript configuration
- [angular.json](angular.json) - Angular CLI configuration
- [vitest.config.ts](vitest.config.ts) - Test runner configuration
- [app.config.ts](src/app/app.config.ts) - Application providers and PrimeNG theme configuration

### PrimeNG Theme

The application uses PrimeNG Aura theme configured in [app.config.ts](src/app/app.config.ts):

```typescript
providePrimeNG({
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: false,
      cssLayer: false,
    },
  },
});
```

You can change the theme preset by importing different presets from `@primeuix/themes`.

### Error Handling

The application implements error handling at two levels:

- GlobalErrorHandler: Custom Angular ErrorHandler for unhandled exceptions
- Error Interceptor: HTTP error handling that displays toast notifications, logs errors, and returns EMPTY to prevent error propagation

## License

This project is licensed under the GNU General Public License v3.0. See the [LICENCE](./LICENCE) file for details.

## Contributing

Contributions are welcome. Please submit issues and pull requests through the repository.

## Additional Resources

- [Angular Documentation](https://angular.io/docs)
- [PrimeNG Documentation](https://primeng.org)
- [TZKT API Documentation](https://tzkt.io/api/)
- [RxJS Guide](https://rxjs.dev/)
