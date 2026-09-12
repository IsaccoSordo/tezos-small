# Tezos Small

[![Angular](https://img.shields.io/badge/Angular-22.0-dd0031?logo=angular)](https://angular.io)
[![NgRx](https://img.shields.io/badge/NgRx-22.0-a907a7?logo=ngrx)](https://ngrx.io/)
[![PrimeNG](https://img.shields.io/badge/PrimeNG-22.0-black?logo=primeng)](https://primeng.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6?logo=typescript)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-GPL--3.0-blue)](#license)

An Angular application for exploring Tezos blockchain blocks, transactions, and accounts through the [TZKT API](https://tzkt.io/api/).

## Features

**Block Explorer**

- Browse Tezos blockchain blocks in a paginated table
- View block details including hash, level, proposer, and timestamp
- Display transaction counts per block

**Global Search**

- Search by block level (e.g., `12345`)
- Search by account address (tz1, tz2, tz3, KT1)
- Search by account alias with autocomplete suggestions
- Visual icons distinguish blocks, contracts, and user accounts

**Account Explorer**

- View account details (balance, type, first activity)
- Browse account operations with pagination
- View token balances for any account
- Contract-specific features:
  - Entrypoints and storage inspection
  - Contract code and interface
  - On-chain views
  - Contract events

**Transaction Details**

- View individual block transactions
- Display sender, receiver, amount, and transaction status

**Technical Highlights**

- Zoneless change detection (Angular 22)
- Standalone components with signal-based reactivity
- NgRx SignalStore with `rxMethod` for reactive data loading
- Route-driven state management
- Purely presentational components

## Quick Start

### Prerequisites

- Node.js: v22.22.3+, v24.15+, or v26+ (Angular 22's engines range)
- npm: v8.0.0+

### Installation

```bash
git clone https://github.com/IsaccoSordo/tezos-small.git
cd tezos-small
npm install
```

### Environment Setup

1. Copy `.env.example` to `.env`
2. Fill in your PrimeNG license key:

```bash
PRIMENG_UI_KEY=your_primeng_license_key
```

### Development

```bash
npm start
```

Navigate to `http://localhost:4200/`.

### Production Build

```bash
npm run build:prod
```

## Testing

```bash
npm test              # Watch mode
npm run test:ci       # Run once (CI)
npm test -- --coverage # Coverage reports
```

Tests use [Vitest](https://vitest.dev) with jsdom.

## Project Structure

```
src/app/
├── account-explorer/         # Account/contract explorer
│   ├── account-header/       # Account info header
│   └── tabs/                 # Operations, tokens, events, code, etc.
├── blocks-overview/          # Main blocks listing
├── config/
│   ├── api.config.ts         # TZKT API base URL
│   ├── constants.ts          # App constants
│   ├── httpContext.config.ts # HTTP context tokens
│   └── search.config.ts      # Search patterns
├── core/
│   └── global-error.handler.ts
├── details/                  # Block transaction details
├── interceptors/
│   ├── error.interceptor.ts  # Error handling with toast
│   └── loading.interceptor.ts
├── models/
│   ├── account.model.ts      # Account/contract interfaces
│   ├── search.model.ts       # SearchResult, AccountSuggestion
│   ├── tzkt.model.ts         # Block, Transaction, TZKTState
│   ├── ui.model.ts           # Column, TableData, RouteType, PaginatorMode
│   └── index.ts              # Barrel file
├── navbar/                   # Navigation with search
├── services/
│   ├── account.service.ts    # Account API
│   ├── blocks.service.ts     # Blocks API
│   ├── contract.service.ts   # Contract API
│   └── search.service.ts     # Search suggestions API
├── store/
│   ├── tzkt.store.ts         # Main store orchestrator
│   └── features/
│       ├── account-data.feature.ts
│       ├── blocks-data.feature.ts
│       ├── contract-data.feature.ts
│       ├── router-sync.feature.ts
│       ├── search-data.feature.ts
│       ├── state-mutations.feature.ts
│       ├── transactions-data.feature.ts
│       ├── url-utils.ts
│       └── index.ts          # Barrel file
├── ui/
│   ├── cursor-paginator/     # Cursor-based pagination
│   ├── search/               # Global search component
│   ├── spinner/              # Loading indicator
│   └── table/                # Reusable data table
├── utils/
│   └── format.utils.ts       # Formatting helpers
├── app.routes.ts
├── app.config.ts
└── app.component.ts
```

## Architecture

### State Management

NgRx SignalStore with composable `signalStoreFeature` slices:

```typescript
export const Store = signalStore(
  { providedIn: 'root' },
  withState<TZKTState>({
    blocks: [],
    count: 0,
    loadingCounter: 0,
    transactions: [],
    searchSuggestions: [],
    account: null,
    accountOperations: [],
    // ... more state
  }),
  withStateMutations(),
  withBlocksData(),
  withTransactionsData(),
  withAccountData(),
  withContractData(),
  withSearchData(),
  withRouterSync()
);
```

| Feature                | Purpose                                    |
| ---------------------- | ------------------------------------------ |
| `withStateMutations`   | Basic setters for state properties         |
| `withBlocksData`       | Block loading and polling                  |
| `withTransactionsData` | Transaction loading                        |
| `withAccountData`      | Account/operations loading                 |
| `withContractData`     | Contract-specific data (entrypoints, etc.) |
| `withSearchData`       | Search suggestions with debounce           |
| `withRouterSync`       | Route-driven data loading                  |

### Key Components

| Component                  | Purpose                                |
| -------------------------- | -------------------------------------- |
| `BlocksOverviewComponent`  | Displays blocks from store             |
| `DetailsComponent`         | Displays block transactions            |
| `AccountExplorerComponent` | Account/contract details with tabs     |
| `SearchComponent`          | Global search with autocomplete        |
| `TableComponent`           | Reusable paginated table               |
| `NavbarComponent`          | Navigation header with search          |

### HTTP Interceptors

- **Error**: Toast notifications via PrimeNG MessageService
- **Loading**: Counter-based loading state management

Response caching is handled via [@ngneat/cashew](https://github.com/ngneat/cashew) through HTTP context tokens.

## API Reference

Base URL: `https://api.tzkt.io/v1`

| Endpoint                                 | Description               |
| ---------------------------------------- | ------------------------- |
| `/blocks/count`                          | Total block count         |
| `/blocks?limit=X&offset=Y`               | Paginated blocks          |
| `/operations/transactions?level=X`       | Block transactions        |
| `/accounts/{address}`                    | Account details           |
| `/accounts/{address}/operations`         | Account operations        |
| `/tokens/balances?account={address}`     | Token balances            |
| `/contracts/{address}/entrypoints`       | Contract entrypoints      |
| `/contracts/{address}/storage`           | Contract storage          |
| `/contracts/{address}/interface`         | Contract interface        |
| `/suggest/accounts/{query}`              | Account suggestions       |

## Configuration

### Environment Variables

| Variable         | Description                    |
| ---------------- | ------------------------------- |
| `PRIMENG_UI_KEY` | PrimeNG license key   |

## Commands

| Command              | Description                               |
| -------------------- | ----------------------------------------- |
| `npm start`          | Start dev server at http://localhost:4200 |
| `npm run build:prod` | Build for production                      |
| `npm test`           | Run tests in watch mode                   |
| `npm run test:ci`    | Run tests once                            |
| `npm run typecheck`  | Type-check the app and spec tsconfigs     |
| `npm run lint`       | Run ESLint (Angular templates)            |
| `npm run check`      | Format and lint with Biome, fixing issues |
| `npm run check:ci`   | Check formatting and lint with Biome      |

## License

GNU General Public License v3.0. See [LICENCE](./LICENCE).

## Resources

- [Angular](https://angular.io/docs)
- [NgRx SignalStore](https://ngrx.io/guide/signals)
- [PrimeNG](https://primeng.org)
- [TZKT API](https://tzkt.io/api/)
