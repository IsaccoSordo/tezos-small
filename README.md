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

**Authentication**

- Firebase Authentication with Google and GitHub OAuth providers
- Account linking for users with multiple OAuth accounts
- Protected routes with auth guards
- JWT token handling via HTTP interceptor

**Technical Implementation**

- Zoneless change detection (Angular 21)
- Standalone components with signal-based reactivity
- NgRx SignalStore with `rxMethod` for reactive data loading
- Route-driven state management (store reacts to URL changes)
- Purely presentational components
- Firebase integration via @angular/fire
- Reactive data flow with RxJS and `toSignal()`
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
- Firebase project with Authentication enabled

### Installation

```bash
# Clone the repository
git clone https://github.com/IsaccoSordo/tezos-small.git
cd tezos-small

# Install dependencies
npm install
```

### Environment Setup

1. Copy `.env.example` to `.env`
2. Fill in your Firebase credentials:

```bash
FIREBASE_API_KEY=your_api_key
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_APP_ID=your_app_id
FIREBASE_SENDER_ID=your_sender_id
FIREBASE_MEASUREMENT_ID=your_measurement_id
```

3. Enable Google and GitHub sign-in providers in Firebase Console

### Development Server

```bash
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload when you modify source files.

### Build for Production

```bash
npm run build:prod
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
├── blocks-overview/          # Main blocks listing page (presentational)
├── config/
│   ├── auth.config.ts       # Protected API patterns
│   └── cache.config.ts      # HTTP cache configuration
├── core/
│   └── global-error.handler.ts # Global error handling
├── details/                  # Transaction details page (presentational)
├── guards/
│   └── auth.guard.ts        # Route guards (authGuard, guestGuard)
├── interceptors/
│   ├── auth.interceptor.ts  # Bearer token injection
│   ├── error.interceptor.ts # HTTP error handling with toast
│   └── loading.interceptor.ts # Loading state management
├── login/                    # Login page with OAuth
├── models/
│   ├── auth.model.ts        # Auth interfaces (User, AuthState)
│   ├── tzkt.model.ts        # TZKT interfaces (Block, Transaction)
│   ├── ui.model.ts          # UI interfaces (Column, TableData)
│   └── index.ts             # Barrel file for imports
├── navbar/                   # Navigation component
├── services/
│   ├── auth.service.ts      # Firebase Auth with @angular/fire
│   └── tzkt.service.ts      # TZKT API integration (thin HTTP layer)
├── store/
│   ├── tzkt.store.ts        # Orchestrator - composes feature slices
│   └── features/            # Composable signalStoreFeature slices
│       ├── state-mutations.feature.ts  # withStateMutations
│       ├── blocks-data.feature.ts      # withBlocksData
│       ├── transactions-data.feature.ts # withTransactionsData
│       ├── router-sync.feature.ts      # withRouterSync
│       ├── url-utils.ts                # URL parsing utilities
│       └── index.ts                    # Barrel file
├── ui/                       # Reusable UI components
│   ├── spinner/
│   └── table/
├── app.routes.ts            # Application routing (lazy loading)
├── app.config.ts            # Global configuration
└── app.component.ts         # Root component
```

### Key Components

| Component                 | Purpose                                           |
| ------------------------- | ------------------------------------------------- |
| `BlocksOverviewComponent` | Presentational - displays blocks from store       |
| `DetailsComponent`        | Presentational - displays transactions from store |
| `LoginComponent`          | OAuth login with Google/GitHub                    |
| `NavbarComponent`         | Navigation header with auth status                |
| `TableComponent`          | Reusable data table with pagination               |
| `SpinnerComponent`        | Loading indicator                                 |
| `Store`                   | Route-driven state management with rxMethod       |

### Authentication

The application uses Firebase Authentication via `@angular/fire`:

```typescript
// AuthService using toSignal pattern
@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);

  // Firebase user as signal - automatically updates
  private firebaseUser = toSignal(user(this.auth));

  // ID token as signal - automatically refreshes
  readonly token = toSignal(idToken(this.auth));

  // Computed signals for derived state
  readonly user = computed(() => this.mapFirebaseUser(this.firebaseUser()));
  readonly isAuthenticated = computed(() => !!this.firebaseUser());

  login(provider = 'google'): Observable<User> {
    return from(signInWithPopup(this.auth, authProvider)).pipe(
      map((result) => this.mapFirebaseUser(result.user))
    );
  }
}
```

**Key Features:**

- Signal-based state using `toSignal()` from `@angular/core/rxjs-interop`
- Automatic token refresh via `idToken()` observable
- Account linking for users with same email across providers
- No subscriptions or constructors needed

### State Management

The application uses NgRx SignalStore with `signalStoreFeature` for composable, testable state slices:

```typescript
// tzkt.store.ts
export const Store = signalStore(
  { providedIn: 'root' },
  withState<TZKTState>({
    blocks: [],
    count: 0,
    errors: [],
    loadingCounter: 0,
    transactions: [],
  }),
  withStateMutations(),    // Basic setters and resetState
  withBlocksData(),        // Block loading rxMethods
  withTransactionsData(),  // Transaction loading rxMethods
  withRouterSync()         // Router event subscription (must be last)
);
```

**Feature Slices:**

| Feature | Purpose |
|---------|---------|
| `withStateMutations` | Basic setters: setBlocks, setCount, resetState, etc. |
| `withBlocksData` | loadBlocks, loadBlocksCount, pollBlocksCount rxMethods |
| `withTransactionsData` | loadTransactions rxMethod |
| `withRouterSync` | Subscribes to Router events, triggers data loading |

**signalStoreFeature benefits:**

- Each feature can be tested in isolation
- Features can be shared across stores
- Separate files reduce merge conflicts

### HTTP Interceptors

**Auth Interceptor**

Attaches Bearer token to protected API requests:

- Uses `AuthService.token()` signal
- Only adds token for URLs matching `PROTECTED_API_PATTERNS`

**Cache Interceptor** ([@ngneat/cashew](https://github.com/ngneat/cashew))

- Configurable TTL per request via `withCache({ ttl: ms })`
- Automatic cache key generation

**Error Interceptor**

- Displays toast notifications via PrimeNG `MessageService`
- Returns EMPTY observable to prevent error propagation

**Loading Interceptor**

- Counter-based approach handles concurrent requests

### API Integration

The `TzktService` handles all blockchain API calls:

- `getBlocksCount()` - Fetch total block count
- `getBlocks(limit, offset)` - Paginated block listing
- `getTransactionsCount(level)` - Get transaction count for a block
- `getTransactions(level)` - Fetch transactions for a block

## Deployment

### GitHub Pages

The application is deployed to GitHub Pages via GitHub Actions:

- **On Pull Request**: Runs lint, format, and test checks
- **On Push to Main**: Runs checks, builds, and deploys to GitHub Pages

The workflow uses environment secrets from the `production` environment in GitHub repository settings.

### Manual Deployment

```bash
npm run build:prod
# Deploy dist/tezos-small/browser to your hosting provider
```

## Dependencies

### Core

- `@angular/*@21.0.6` - Angular framework
- `@angular/fire@21.0.0-rc.0` - Firebase integration for Angular
- `@ngrx/signals@21.0.0` - NgRx SignalStore for state management
- `@ngneat/cashew@5.3.0` - HTTP response caching
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

### User

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}
```

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

## Configuration

### Environment Variables

Required environment variables for Firebase:

| Variable                  | Description                  |
| ------------------------- | ---------------------------- |
| `FIREBASE_API_KEY`        | Firebase API key             |
| `FIREBASE_PROJECT_ID`     | Firebase project ID          |
| `FIREBASE_APP_ID`         | Firebase app ID              |
| `FIREBASE_SENDER_ID`      | Firebase messaging sender ID |
| `FIREBASE_MEASUREMENT_ID` | Firebase Analytics ID        |

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

## Development Commands

| Command              | Description                              |
| -------------------- | ---------------------------------------- |
| `npm install`        | Install dependencies                     |
| `npm start`          | Start dev server at http://localhost:4200|
| `npm run build:prod` | Build for production                     |
| `npm test`           | Run tests in watch mode                  |
| `npm run test:ci`    | Run tests once (CI)                      |
| `npm run lint`       | Run ESLint                               |
| `npm run format`     | Format code with Prettier                |

## License

This project is licensed under the GNU General Public License v3.0. See the [LICENCE](./LICENCE) file for details.

## Contributing

Contributions are welcome. Please submit issues and pull requests through the repository.

## Additional Resources

- [Angular Documentation](https://angular.io/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [AngularFire Documentation](https://github.com/angular/angularfire)
- [PrimeNG Documentation](https://primeng.org)
- [TZKT API Documentation](https://tzkt.io/api/)
- [RxJS Guide](https://rxjs.dev/)
