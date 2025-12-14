# Tezos Small

<div align="center">

[![Angular](https://img.shields.io/badge/Angular-21.0-dd0031?logo=angular)](https://angular.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript)](https://www.typescriptlang.org)
[![PrimeNG](https://img.shields.io/badge/PrimeNG-Latest-007ad9?logo=prime)](https://primeng.org)
[![License](https://img.shields.io/badge/License-MIT-green)](#license)

A sleek, modern Angular application for exploring **Tezos blockchain** blocks and transactions through the [TZKT API](https://tzkt.io/api/), built with **PrimeNG** UI components.

[Features](#features) • [Quick Start](#quick-start) • [Development](#development) • [Architecture](#architecture)

</div>

---

## 🎯 Features

✨ **Block Explorer**

- Browse Tezos blockchain blocks in a paginated table
- View block details including hash, level, proposer, and timestamp
- Real-time transaction counts per block

📊 **Transaction Details**

- Deep-dive into individual block transactions
- View sender, receiver, amount, and transaction status
- Clean, responsive table layout

⚡ **Performance & UX**

- **Zoneless change detection** (Angular 21) - no Zone.js overhead
- Standalone Angular components with signal-based reactivity
- Reactive data flow with RxJS
- Real-time block count updates
- Smart loading states with PrimeNG ProgressSpinner
- Toast notifications for error handling
- PrimeNG Aura theme for modern, beautiful UI

🎨 **Modern Stack**

- Angular 21 with latest standalone APIs
- **PrimeNG** - Enterprise-grade UI component library
- TypeScript strict mode
- SCSS styling with modular components
- 90+ available PrimeNG components for future enhancements

---

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v20.19+ or v22.12+
- **npm**: v8.0.0 or higher

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

---

## 🧪 Testing

This project follows comprehensive testing best practices with full test coverage for components, services, interceptors, and UI elements.

### Prerequisites

Ensure you're using **Node.js v20.19+ or v22.12+** for running tests. The project uses Angular 21's testing infrastructure.

### Run Unit Tests

```bash
npm test                           # Watch mode with auto-reload
npm test -- --watch=false          # Run once (for CI/automated testing)
npm test -- --code-coverage        # Generate coverage reports
```

Tests are executed via [Karma](https://karma-runner.github.io) using [Jasmine](https://jasmine.github.io).

**Note:** The test runner auto-detects your installed browsers:
- **macOS**: Firefox → Chrome → Safari (in order of preference)
- **Windows**: Chrome
- **Linux**: ChromeHeadless

### Testing Best Practices

Our test suite follows Angular community best practices:

**🔧 Helper Functions**
- Reusable helper functions reduce code duplication for common mock patterns
- Examples: `initializeComponent()`, `flushCountRequest()`, `flushInitialBlocksRequest()`

**📋 Single Responsibility**
- Each test verifies one specific behavior
- Tests are named clearly with "should..." statements
- Focused assertions make failures easy to diagnose

**🎯 Test Organization**
- Nested `describe` blocks group related tests by feature/scenario
- `beforeEach` sets up common test fixtures
- `afterEach` cleans up resources and verifies HTTP mocks

**⏱️ Async Testing**
- `fakeAsync` with `tick()` for timer-based operations
- `fixture.destroy()` ensures proper cleanup of subscriptions
- `HttpTestingController` verifies all HTTP interactions

**Example Test Structure:**

```typescript
describe('MyComponent', () => {
  // Helper functions for common patterns
  const initializeComponent = () => {
    fixture.detectChanges();
    tick(); // Handle async timers
  };

  beforeEach(async () => {
    // Setup common test fixtures
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no pending requests
  });

  it('should initialize and fetch data', fakeAsync(() => {
    initializeComponent();
    flushMockRequests();

    expect(component.data()).toBeTruthy();

    fixture.destroy(); // Cleanup
  }));
});
```

All test files include JSDoc headers documenting the patterns applied. See [blocks-overview.component.spec.ts](src/app/blocks-overview/blocks-overview.component.spec.ts) for a complete example.

---

## 📁 Architecture

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

| Component                    | Purpose                                 |
| ---------------------------- | --------------------------------------- |
| `BlocksOverviewComponent`    | Displays paginated list of blocks       |
| `DetailsComponent`           | Shows transactions for a specific block |
| `NavbarComponent`            | Navigation header with branding         |
| `TableComponent`             | Reusable data table with pagination     |
| `SpinnerComponent`           | Loading indicator                       |

### State Management

Uses **NgRx SignalStore** for scalable, reactive state management:

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
  })),
);
```

**Key Benefits:**
- ✅ **NgRx SignalStore** - Industry-standard state management solution
- ✅ **Immutable Updates** - `patchState()` ensures state immutability
- ✅ **Auto-exposed Signals** - State properties automatically become signals
- ✅ **Scalable Pattern** - `withState()` and `withMethods()` for organized code
- ✅ **Type-Safe** - Full TypeScript support with proper inference
- ✅ **No Boilerplate** - Cleaner than manual signal management

### HTTP Interceptors

The application uses **functional HTTP interceptors** (Angular 21+) for cross-cutting concerns:

#### Error Interceptor

The `errorInterceptor` provides centralized HTTP error handling:

- **Intercepts all HTTP errors** and displays user-friendly toast notifications via PrimeNG `MessageService`
- **Status-specific messages** for common HTTP errors (404, 500, 503, etc.)
- **Automatic error logging** to console for debugging
- **Rethrows errors** so components can handle them if needed

#### Loading Interceptor

The `loadingInterceptor` automatically manages the loading counter for all HTTP requests:

- **Increments** the counter when any HTTP request starts
- **Decrements** the counter when the request completes (success or error)
- **Counter-based approach** ensures the loading indicator remains visible until all concurrent requests finish

**Benefits:**

- No manual error/loading state management in service methods
- Handles concurrent requests correctly
- Centralized cross-cutting concerns
- Scalable and maintainable

Both interceptors are registered globally in [app.config.ts](src/app/app.config.ts) using the modern `withInterceptors()` pattern.

### API Integration

The `TzktService` handles all blockchain API calls:

- `getBlocksCount()` - Fetch total block count
- `getBlocks(limit, offset)` - Paginated block listing
- `getTransactionsCount(level)` - Get transaction count for a block
- `getTransactions(level)` - Fetch transactions for a block

All loading and error states are automatically managed by HTTP interceptors.

---

## 🛠️ Development Guide

### Code Scaffolding

Generate new components with Angular CLI:

```bash
ng generate component component-name
ng generate directive|pipe|service|class|guard|interface|enum
```

### Code Style

- Uses **OnPush change detection** for optimal performance
- **Standalone components** (no NgModules)
- **TypeScript strict mode** enabled
- **SCSS** for styling with BEM naming conventions
- **NgRx SignalStore** - industry-standard state management with signals

### RxJS Operators

Key operators used in the application:

- `tap` - Side effects (state updates, logging) without value transformation
- `map` - Transform emitted values
- `catchError` - Handle errors gracefully
- `finalize` - Cleanup logic (e.g., loading state)
- `forkJoin` - Combine multiple async operations

---

## 📦 Dependencies

### Core

- `@angular/*@21.0.5` - Angular framework
- `@ngrx/signals@20.1.0` - NgRx SignalStore for state management
- `rxjs@7.8.2` - Reactive programming
- `typescript@5.9.3` - Type safety

### UI

- `primeng@21.0.1` - Enterprise Angular UI component library
- `@primeuix/themes@2.0.2` - Modern theming system
- `primeicons@7.0.0` - Premium icon library

### Testing

- `karma@6.4.4` - Test runner
- `jasmine-core@5.5.0` - Testing framework
- Multi-browser support (Chrome, Firefox, Safari)

---

## 🌐 API Reference

This application uses the [TZKT API](https://tzkt.io/api/) - a free REST API for the Tezos blockchain.

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

---

## 📋 Interfaces

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

---

## 🔧 Configuration

### Environment Setup

Configuration can be found in:

- [tsconfig.json](tsconfig.json) - TypeScript configuration
- [angular.json](angular.json) - Angular CLI configuration
- [karma.conf.js](karma.conf.js) - Test runner configuration
- [app.config.ts](src/app/app.config.ts) - Application providers and PrimeNG theme configuration

### PrimeNG Theme

The application uses **PrimeNG Aura** theme configured via TypeScript in [app.config.ts](src/app/app.config.ts):

```typescript
providePrimeNG({
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: false,
      cssLayer: false,
    },
  },
})
```

You can change the theme preset by importing different presets from `@primeuix/themes`.

### Error Handling

The application implements comprehensive error handling:

- **GlobalErrorHandler** - Custom Angular ErrorHandler for catching unhandled errors
- **Error Interceptor** - HTTP-specific error handling with toast notifications
- **MessageService** - PrimeNG service for displaying user-friendly error messages

### Browser Support

The test runner automatically detects and uses your default installed browser:

- **macOS**: Firefox > Chrome > Safari
- **Windows**: Chrome
- **Linux**: ChromeHeadless

---

## 📝 License

This project is licensed under the MIT License. See the [LICENCE](./LICENCE) file for details.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

---

## 📚 Additional Resources

- [Angular Documentation](https://angular.io/docs)
- [PrimeNG Documentation](https://primeng.org)
- [TZKT API Documentation](https://tzkt.io/api/)
- [RxJS Guide](https://rxjs.dev/)

---
