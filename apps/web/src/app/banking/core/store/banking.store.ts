import { computed, inject } from '@angular/core';
import { signalStore, withComputed, withHooks, withMethods, withProps } from '@ngrx/signals';

import { AccountsStore } from './accounts.store';
import { TransactionsStore } from './transactions.store';
import {
  ExtendedTransaction,
  TransactionCreate,
} from '@app/core/transaction/transaction.interface';
import { BankAccount, NestedBankAccount } from '@app/core/bank-account/bank-account.interface';

function toNested(a: BankAccount): NestedBankAccount {
  return {
    bank_name: a.bank_name,
    account_holder_name: a.account_holder_name,
    sort_code: a.sort_code,
    account_number: a.account_number,
  };
}

export const BankingStore = signalStore(
  // Not providing in root to allow multiple instances for different banking components if needed.
  // This is a facade feature store that combines accounts and transactions stores
  // to provide extended transactions with account details.
  // { providedIn: 'root' },

  withProps(() => ({
    accountsStore: inject(AccountsStore),
    transactionsStore: inject(TransactionsStore),
  })),
  // withEntities({
  //   entity: type<BankAccount>(),
  // }),
  withComputed((store) => ({
    accounts: computed(() => store.accountsStore.accounts()),
    extendedTransactions: computed((): ExtendedTransaction[] => {
      const accounts = store.accountsStore.accounts();
      const transactions = store.transactionsStore.transactions();

      const byId = new Map(accounts.map((a) => [a.id, a]));

      return transactions
        .map((t): ExtendedTransaction | null => {
          const source = t.source_bank_account_id ? byId.get(t.source_bank_account_id) : null;
          const target = t.target_bank_account_id ? byId.get(t.target_bank_account_id) : null;

          return {
            ...t,
            source: source ? toNested(source) : undefined,
            target: target ? toNested(target) : undefined,
          };
        })
        .filter((x): x is ExtendedTransaction => !!x);
    }),
  })),
  withMethods((store) => ({
    create(transaction: TransactionCreate) {
      store.transactionsStore.create(transaction);
    },
    load() {
      store.accountsStore.load();
      store.transactionsStore.load();
    },
  })),
  withHooks({
    onInit() {
      console.log('store initialized');
    },
    onDestroy() {
      console.log('store destroyed');
    },
  })
);
