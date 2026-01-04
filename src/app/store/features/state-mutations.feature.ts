import {
  signalStoreFeature,
  withMethods,
  patchState,
  type,
} from '@ngrx/signals';
import {
  Block,
  Transaction,
  TZKTState,
  AccountInfo,
  ContractInfo,
  AccountOperation,
  ContractEntrypoint,
  ContractStorage,
  ContractInterface,
  ContractView,
  TokenBalance,
  ContractEvent,
} from '../../models';
import { DEFAULT_TAB } from '../../config/constants';

export function withStateMutations() {
  return signalStoreFeature(
    { state: type<TZKTState>() },
    withMethods((store) => ({
      setBlocks(blocks: Block[]): void {
        patchState(store, { blocks });
      },

      setCount(count: number): void {
        patchState(store, { count });
      },

      setTransactions(transactions: Transaction[]): void {
        patchState(store, { transactions });
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

      setLoadingCounter(count: number): void {
        patchState(store, { loadingCounter: count });
      },

      setAccount(account: AccountInfo | ContractInfo | null): void {
        patchState(store, { account });
      },

      setAccountOperations(accountOperations: AccountOperation[]): void {
        patchState(store, { accountOperations });
      },

      setAccountOperationsCount(accountOperationsCount: number): void {
        patchState(store, { accountOperationsCount });
      },

      setEntrypoints(entrypoints: ContractEntrypoint[]): void {
        patchState(store, { entrypoints });
      },

      setStorage(storage: ContractStorage | null): void {
        patchState(store, { storage });
      },

      setContractInterface(contractInterface: ContractInterface | null): void {
        patchState(store, { contractInterface });
      },

      setContractViews(contractViews: ContractView[]): void {
        patchState(store, { contractViews });
      },

      setTokenBalances(tokenBalances: TokenBalance[]): void {
        patchState(store, { tokenBalances });
      },

      setTokenBalancesCount(tokenBalancesCount: number): void {
        patchState(store, { tokenBalancesCount });
      },

      setContractEvents(contractEvents: ContractEvent[]): void {
        patchState(store, { contractEvents });
      },

      setContractEventsCount(contractEventsCount: number): void {
        patchState(store, { contractEventsCount });
      },

      setActiveTab(activeTab: string): void {
        patchState(store, { activeTab });
      },

      resetState(): void {
        patchState(store, {
          blocks: [],
          count: 0,
          transactions: [],
          loadingCounter: 0,
          account: null,
          accountOperations: [],
          accountOperationsCount: 0,
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
    }))
  );
}
