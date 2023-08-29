import { Injectable, inject } from '@angular/core';
import { Block, Transaction } from '../common';
import { Store } from '../store/store.service';

@Injectable({
  providedIn: 'root',
})
export class TzktService {
  store = inject(Store);

  getBlocksCount() {
    fetch('https://api.tzkt.io/v1/blocks/count')
      .then((response) => response.json())
      .then((count: number) => this.store.state.count.set(count));
  }

  getBlocks(limit: number, offset: number) {
    fetch(
      `https://api.tzkt.io/v1/blocks?limit=${limit}&offset.pg=${offset}&sort.desc=${'level'}`
    )
      .then((response) => response.json())
      .then((blocks: Block[]) => {
        blocks.map((block) => this.getTransactionsCount(block));
        this.store.state.blocks.set(blocks);
      });
  }

  getTransactionsCount(block: Block) {
    fetch(
      `https://api.tzkt.io/v1/operations/transactions/count?level=${block.level}`
    )
      .then((response) => response.json())
      .then((count: number) => (block.transactions = count));
  }

  getTransactions(level: number) {
    fetch(`https://api.tzkt.io/v1/operations/transactions?level=${level}`)
      .then((response) => response.json())
      .then((transactions: Transaction[]) =>
        this.store.state.transactions.set(transactions)
      );
  }
}
