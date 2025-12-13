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

- Deep dive into individual block transactions
- View sender, receiver, amount, and transaction status
- Clean, responsive table layout

⚡ **Performance & UX**

- Standalone Angular components with OnPush change detection
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

- **Node.js**: v22.12.0 or higher
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

This project follows comprehensive testing best practices with **62 test suites** covering components, services, and UI elements.

### Prerequisites

Ensure you're using **Node.js v22.12+** or **v20.19+** for running tests. The project uses Angular 21's testing infrastructure.

### Run Unit Tests

```bash
npm test
```

Tests are executed via [Karma](https://karma-runner.github.io) using [Jasmine](https://jasmine.github.io).

**Note:** The test runner auto-detects your installed browsers:
- **macOS**: Firefox → Chrome → Safari (in order of preference)
- **Windows**: Chrome
- **Linux**: ChromeHeadless

### Run Tests in Watch Mode

```bash
npm test
```

Tests automatically re-run when you modify source files. Press `Ctrl+C` to stop.

### Generate Coverage Report

```bash
npm test -- --code-coverage
```

Coverage reports are generated in `coverage/tezos-small/` directory.

### Run Tests in CI/Headless Mode

```bash
npm test -- --browsers=Firefox --watch=false
```

---

## 📋 Testing Architecture

### Test Structure

All test files follow the `.spec.ts` naming convention and are colocated with their source files:

```
src/app/
├── blocks-overview/
│   ├── blocks-overview.component.ts
│   └── blocks-overview.component.spec.ts ✅
├── services/
│   ├── tzkt.service.ts
│   └── tzkt.service.spec.ts ✅
└── ui/
    ├── table/
    │   ├── table.component.ts
    │   └── table.component.spec.ts ✅
```

### Key Testing Patterns

#### 1. **HTTP Interceptor Testing**

The `loadingInterceptor` is tested using `fakeAsync` and `tick()` to ensure proper async behavior:

```typescript
it('should increment and decrement loading counter', fakeAsync(() => {
  expect(store.state.loadingCounter()).toBe(0);

  service.getBlocksCount().subscribe();
  expect(store.state.loadingCounter()).toBe(1);

  const req = httpMock.expectOne(`${API_BASE}/blocks/count`);
  req.flush(100);
  tick(); // Ensure finalize() completes

  expect(store.state.loadingCounter()).toBe(0);
}));
```

#### 2. **Signal-Based State Testing**

All components use Angular Signals, which are tested by verifying state changes:

```typescript
it('should update store signal when data is fetched', () => {
  service.getBlocks(10, 0).subscribe();

  const req = httpMock.expectOne(req => req.url.includes('/blocks'));
  req.flush(mockBlocks);

  expect(store.state.blocks()).toEqual(mockBlocks);
});
```

#### 3. **BehaviorSubject Event Emission**

The `TableComponent` uses BehaviorSubject for refresh events, tested with proper emission handling:

```typescript
it('should emit initial value on subscription', (done) => {
  fixture.componentRef.setInput('count', 100);
  fixture.detectChanges();

  component.refresh.subscribe(data => {
    expect(data.count).toBe(100);
    done();
  });
});
```

#### 4. **HTTP Request Flushing**

All HTTP tests properly flush requests to avoid "Expected no open requests" errors:

```typescript
beforeEach(() => {
  // Setup with HttpTestingController
  httpMock = TestBed.inject(HttpTestingController);
});

afterEach(() => {
  httpMock.verify(); // Ensures all requests are flushed
});
```

#### 5. **Nested Describe Blocks**

Tests are organized using nested `describe()` blocks for better readability:

```typescript
describe('TableComponent', () => {
  describe('initialization', () => {
    it('should create', () => { ... });
  });

  describe('input signals', () => {
    it('should accept and update input values', () => { ... });
  });

  describe('refresh event emission', () => {
    it('should emit initial value', () => { ... });
  });
});
```

---

## 🎯 Test Coverage

Current test coverage includes:

### Components (100% Coverage)
- ✅ `AppComponent` - Application root
- ✅ `BlocksOverviewComponent` - Blocks listing with pagination
- ✅ `DetailsComponent` - Transaction details view
- ✅ `NavbarComponent` - Navigation header
- ✅ `TableComponent` - Reusable data table
- ✅ `SpinnerComponent` - Loading indicator

### Services (100% Coverage)
- ✅ `TzktService` - API integration
  - Block fetching and counting
  - Transaction retrieval
  - Error handling
  - Loading state management
- ✅ `Store` - Signal-based state management

### Interceptors (100% Coverage)
- ✅ `loadingInterceptor` - Automatic loading state tracking

---

## 🛡️ Testing Best Practices

### Do's ✅
- **Use `provideHttpClient()` and `provideHttpClientTesting()`** - Modern Angular API
- **Use `fakeAsync` and `tick()`** - For testing async operations with interceptors
- **Always flush HTTP requests** - Call `httpMock.verify()` in `afterEach()`
- **Reset signals in `afterEach()`** - Prevent test pollution
- **Use nested `describe()` blocks** - Organize related tests
- **Test user interactions** - Not just existence checks
- **Test error states** - Handle network failures gracefully

### Don'ts ❌
- **Don't use deprecated `RouterTestingModule`** - Use `provideRouter([])`
- **Don't use `HttpClientModule` in tests** - Use `provideHttpClient()`
- **Don't skip `httpMock.verify()`** - Always verify no pending requests
- **Don't use `declarations` for standalone components** - Use `imports` array
- **Don't forget to test edge cases** - Empty arrays, null values, errors

---

## 🔧 Common Testing Issues & Solutions

### Issue: "Expected no open requests"
**Solution:** Flush all HTTP requests triggered by component initialization:
```typescript
fixture.detectChanges(); // Triggers ngOnInit

const countReq = httpMock.expectOne('/blocks/count');
countReq.flush(100);

const blocksReq = httpMock.expectOne('/blocks');
blocksReq.flush([]);
```

### Issue: "Expected 1 to be 0" (Loading Counter)
**Solution:** Use `fakeAsync` and `tick()` to ensure `finalize()` completes:
```typescript
it('should manage loading state', fakeAsync(() => {
  service.getData().subscribe();

  const req = httpMock.expectOne(url);
  req.flush(data);
  tick(); // Wait for finalize()

  expect(store.state.loadingCounter()).toBe(0);
}));
```

### Issue: Timeout in async tests
**Solution:** Remove `await fixture.whenStable()` and flush requests synchronously:
```typescript
fixture.detectChanges();
httpMock.expectOne(url).flush(data);
// Don't use: await fixture.whenStable()
```

---

## 📚 Additional Testing Resources

- [Angular Testing Guide](https://angular.io/guide/testing)
- [Jasmine Documentation](https://jasmine.github.io/)
- [Karma Configuration](https://karma-runner.github.io/latest/config/configuration-file.html)
- [HttpTestingController API](https://angular.io/api/common/http/testing/HttpTestingController)

---

## 📁 Architecture

### Project Structure

```
src/app/
├── blocks-overview/          # Main blocks listing page
├── details/                  # Transaction details page
├── navbar/                   # Navigation component
├── interceptors/
│   └── loading.interceptor.ts # HTTP loading state interceptor
├── services/
│   └── tzkt.service.ts      # TZKT API integration
├── store/
│   ├── store.service.ts     # Global state management
│   └── tzkt.state.ts        # Reactive signals for state
├── ui/                       # Reusable UI components
│   ├── error-notification/
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
| `TableComponent`             | Reusable data table with pagination     |
| `SpinnerComponent`           | Loading indicator                       |
| `ErrorNotificationComponent` | User-friendly error alerts              |

### State Management

Uses **Angular Signals** (Angular 21) for reactive state:

```typescript
// Centralized state in Store service
blocks = signal<Block[]>([]);
transactions = signal<Transaction[]>([]);
loadingCounter = signal(0);
errors = signal<Error[]>([]);
```

### HTTP Interceptors

The application uses **functional HTTP interceptors** (Angular 21+) for automatic loading state management:

#### Loading Interceptor

The `loadingInterceptor` automatically manages the loading counter for all HTTP requests:

- **Increments** the counter when any HTTP request starts
- **Decrements** the counter when the request completes (success or error)
- **Counter-based approach** ensures the loading indicator remains visible until all concurrent requests finish

**Benefits:**

- No manual loading state management in service methods
- Handles concurrent requests correctly
- Centralized loading logic
- Scalable and maintainable

The interceptor is registered globally in [app.config.ts](src/app/app.config.ts) using the modern `withInterceptors()` pattern.

### API Integration

The `TzktService` handles all blockchain API calls:

- `getBlocksCount()` - Fetch total block count
- `getBlocks(limit, offset)` - Paginated block listing
- `getTransactionsCount(level)` - Get transaction count for a block
- `getTransactions(level)` - Fetch transactions for a block

All loading states are automatically managed by the HTTP interceptor.

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
- `rxjs@7.8.2` - Reactive programming
- `typescript@5.9.3` - Type safety

### UI

- `primeng` - Enterprise Angular UI component library
- `primeicons` - Premium icon library

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

- `tsconfig.json` - TypeScript configuration
- `angular.json` - Angular CLI configuration
- `karma.conf.js` - Test runner configuration

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

## 🎨 UI Framework

This application uses **PrimeNG**, the most comprehensive open-source UI component library for Angular in 2025.

### Why PrimeNG?

- **90+ Components**: From basic buttons to advanced data tables and charts
- **Modern Themes**: Using Aura theme with blue color scheme
- **Enterprise-Ready**: Battle-tested in production environments
- **Excellent Performance**: Optimized for Angular's latest features
- **Active Development**: Regular updates and Angular 21 support
- **Multiple Design Systems**: Supports Material, Bootstrap, Tailwind CSS themes

### PrimeNG Components Used

- **Menubar** - Modern navigation with gradient branding
- **Table** - Advanced data table with pagination, sorting, and filtering
- **Toast** - Elegant notification system for errors
- **ProgressSpinner** - Smooth loading indicator
- **Icons** - PrimeIcons library for consistent iconography

### Theme Customization

The application uses the **Aura Light Blue** theme, which can be changed in [src/styles.scss](src/styles.scss):

```scss
@import 'primeng/resources/themes/lara-light/theme.css';
```

Available themes include: Aura, Material, Bootstrap, Tailwind variants, and many more.

## 📚 Additional Resources

- [Angular Documentation](https://angular.io/docs)
- [PrimeNG Documentation](https://primeng.org)
- [TZKT API Documentation](https://tzkt.io/api/)
- [RxJS Guide](https://rxjs.dev/)

---
