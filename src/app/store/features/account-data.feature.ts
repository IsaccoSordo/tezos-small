import { inject } from '@angular/core';
import {
  signalStoreFeature,
  withMethods,
  patchState,
  type,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import {
  pipe,
  switchMap,
  from,
  mergeMap,
  toArray,
  EMPTY,
  map,
  tap,
} from 'rxjs';
import {
  TZKTState,
  AccountInfo,
  ContractInfo,
  CursorDirection,
} from '../../models';
import { AccountService } from '../../services/account.service';
import { ContractService } from '../../services/contract.service';
import { RATE_LIMIT, DEFAULT_TAB } from '../../config/constants';
import { isContractAddress } from './url-utils';

function getOperationsCount(
  account: AccountInfo | ContractInfo | null
): number {
  if (!account) return 0;
  return (
    (account.numTransactions || 0) +
    (account.numDelegations || 0) +
    (account.numOriginations || 0) +
    (account.numReveals || 0) +
    (account.numActivations || 0) +
    (account.numRegisterConstants || 0) +
    (account.numSetDepositsLimits || 0) +
    (account.numMigrations || 0) +
    (account.numDrainDelegates || 0)
  );
}

export function withAccountData() {
  return signalStoreFeature(
    { state: type<TZKTState>() },
    withMethods(
      (
        store,
        accountService = inject(AccountService),
        contractService = inject(ContractService)
      ) => ({
        loadAccount: rxMethod<string>(
          pipe(
            switchMap((address) => {
              if (!address) return EMPTY;

              const account$ = isContractAddress(address)
                ? contractService.getContract(address)
                : accountService.getAccount(address);

              return account$.pipe(
                tap((account) => patchState(store, { account }))
              );
            })
          )
        ),

        loadAccountOperations: rxMethod<{
          address: string;
          limit: number;
          direction: CursorDirection;
        }>(
          pipe(
            switchMap(({ address, limit, direction }) => {
              if (!address) return EMPTY;

              const cursor = store.operationsCursor();
              const operations = store.accountOperations();

              let lastId: number | undefined;

              switch (direction) {
                case 'first':
                  lastId = undefined;
                  break;
                case 'next':
                  lastId = operations[operations.length - 1]?.id;
                  break;
                default:
                  lastId = cursor.cursors[cursor.currentIndex - 1];
              }

              return accountService
                .getAccountOperations(address, limit, lastId)
                .pipe(
                  tap((operations) => {
                    const hasMore = operations.length === limit;
                    let newCursors = [...cursor.cursors];
                    let newIndex = cursor.currentIndex;

                    if (direction === 'first') {
                      newCursors = [];
                      newIndex = 0;
                    } else if (direction === 'next' && operations.length > 0) {
                      const currentOps = store.accountOperations();
                      if (currentOps.length > 0 && cursor.currentIndex >= 0) {
                        if (newCursors.length <= cursor.currentIndex + 1) {
                          newCursors.push(currentOps[0].id);
                        }
                      }
                      newIndex = cursor.currentIndex + 1;
                    } else if (direction === 'prev') {
                      newIndex = Math.max(0, cursor.currentIndex - 1);
                    }

                    patchState(store, {
                      accountOperations: operations,
                      accountOperationsCount: getOperationsCount(
                        store.account()
                      ),
                      operationsCursor: {
                        cursors: newCursors,
                        currentIndex: newIndex,
                        hasMore,
                      },
                    });
                  })
                );
            })
          )
        ),

        loadTokenBalances: rxMethod<{
          address: string;
          pageSize: number;
          page: number;
        }>(
          pipe(
            switchMap(({ address, pageSize, page }) => {
              if (!address) return EMPTY;

              return from([
                accountService
                  .getTokenBalancesCount(address)
                  .pipe(map((count) => ({ type: 'count' as const, count }))),
                accountService
                  .getTokenBalances(address, pageSize, page * pageSize)
                  .pipe(
                    map((balances) => ({
                      type: 'balances' as const,
                      balances,
                    }))
                  ),
              ]).pipe(
                mergeMap((obs) => obs, RATE_LIMIT.LOW),
                toArray(),
                tap((results) => {
                  const countResult = results.find((r) => r.type === 'count');
                  const balancesResult = results.find(
                    (r) => r.type === 'balances'
                  );
                  patchState(store, {
                    tokenBalances:
                      balancesResult?.type === 'balances'
                        ? balancesResult.balances
                        : [],
                    tokenBalancesCount:
                      countResult?.type === 'count' ? countResult.count : 0,
                  });
                })
              );
            })
          )
        ),

        clearAccountState: () => {
          patchState(store, {
            account: null,
            accountOperations: [],
            accountOperationsCount: 0,
            operationsCursor: { cursors: [], currentIndex: -1, hasMore: true },
            entrypoints: [],
            storage: null,
            contractInterface: null,
            contractViews: [],
            tokenBalances: [],
            tokenBalancesCount: 0,
            contractEvents: [],
            contractEventsCount: 0,
            activeTab: DEFAULT_TAB,
          });
        },
      })
    )
  );
}
