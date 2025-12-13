# Tezos Small

<div align="center">

[![Angular](https://img.shields.io/badge/Angular-21.0-dd0031?logo=angular)](https://angular.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript)](https://www.typescriptlang.org)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952b3?logo=bootstrap)](https://getbootstrap.com)
[![License](https://img.shields.io/badge/License-MIT-green)](#license)

A sleek, modern Angular application for exploring **Tezos blockchain** blocks and transactions through the [TZKT API](https://tzkt.io/api/).

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
- Smart loading states and error handling
- Bootstrap 5 + ng-bootstrap for responsive design

🎨 **Modern Stack**

- Angular 21 with latest standalone APIs
- TypeScript strict mode
- SCSS styling with modular components
- Comprehensive error notification system

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

### Run Unit Tests

```bash
npm test
```

Tests are executed via [Karma](https://karma-runner.github.io) using [Jasmine](https://jasmine.github.io).

**Note:** The test runner auto-detects your installed browsers (Firefox, Chrome, or Safari on macOS).

### Run Tests in Watch Mode

Tests automatically re-run when you modify source files.

### Generate Coverage Report

```bash
npm test -- --code-coverage
```

Coverage reports are generated in `coverage/tezos-small/`.

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

- `bootstrap@5.3.3` - CSS framework
- `@ng-bootstrap/ng-bootstrap@20.0.0` - Angular Bootstrap components

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

## 📚 Additional Resources

- [Angular Documentation](https://angular.io/docs)
- [TZKT API Documentation](https://tzkt.io/api/)
- [RxJS Guide](https://rxjs.dev/)
- [Bootstrap Documentation](https://getbootstrap.com/docs)

---
