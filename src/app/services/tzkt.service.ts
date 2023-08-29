import { Injectable, inject } from '@angular/core';
import { Block, Transaction } from '../common';
import { Store } from '../store/store.service';

@Injectable({
  providedIn: 'root',
})
export class TzktService {
  store = inject(Store);

  getBlocksCount() {
    this.store.state.loadingCounter.update((prev) => prev + 1);
    fetch('https://api.tzkt.io/v1/blocks/count')
      .then((response) => response.json())
      .then((count: number) => this.store.state.count.set(count))
      .then(() => this.store.state.loadingCounter.update((prev) => prev - 1));
  }

  getBlocks(limit: number, offset: number) {
    this.store.state.loadingCounter.update((prev) => prev + 1);
    fetch(
      `https://api.tzkt.io/v1/blocks?limit=${limit}&offset.pg=${offset}&sort.desc=${'level'}`
    )
      .then((response) => response.json())
      .then((blocks: Block[]) => {
        blocks.map((block) => this.getTransactionsCount(block));
        this.store.state.blocks.set(blocks);
      })
      .then(() => this.store.state.loadingCounter.update((prev) => prev - 1));
  }

  getTransactionsCount(block: Block) {
    this.store.state.loadingCounter.update((prev) => prev + 1);
    fetch(
      `https://api.tzkt.io/v1/operations/transactions/count?level=${block.level}`
    )
      .then((response) => response.json())
      .then((count: number) => (block.transactions = count))
      .then(() => this.store.state.loadingCounter.update((prev) => prev - 1));
  }

  getTransactions(level: number) {
    this.store.state.loadingCounter.update((prev) => prev + 1);
    fetch(`https://api.tzkt.io/v1/operations/transactions?level=${level}`)
      .then((response) => response.json())
      .then((transactions: Transaction[]) =>
        this.store.state.transactions.set(transactions)
      )
      .then(() => this.store.state.loadingCounter.update((prev) => prev - 1));
  }
}
