import { inject } from '@angular/core';
import { Transaction, TransactionCreate } from '@app/core/transaction/transaction.interface';
import { TransactionService } from '@app/core/transaction/transaction.service';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, of } from 'rxjs';

export interface TransactionsState {
  transactions: Transaction[];
  loading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
}

export const initialTransactionsState: TransactionsState = {
  transactions: [],
  loading: false,
  error: null,
};

export const TransactionsStore = signalStore(
  { providedIn: 'root' },

  withProps(() => ({
    transactionService: inject(TransactionService),
  })),

  withState(initialTransactionsState),

  withMethods((store) => ({
    load: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() =>
          store.transactionService.getTransactions().pipe(
            tap((transactions) => patchState(store, { transactions, loading: false })),
            catchError((error) => {
              patchState(store, {
                loading: false,
                error: { name: error?.name, message: error?.message },
              });
              return of(void 0);
            })
          )
        )
      )
    ),
    create: rxMethod<TransactionCreate>(
      pipe(
        switchMap((transaction) =>
          store.transactionService.createTransaction(transaction).pipe(
            tap((created) =>
              patchState(store, (state) => ({
                transactions: [...state.transactions, created],
              }))
            ),
            catchError((error) => {
              patchState(store, {
                error: { name: error?.name, message: error?.message },
              });
              return of(void 0);
            })
          )
        )
      )
    ),
  }))
);
