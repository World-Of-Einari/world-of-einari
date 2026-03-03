import { computed, inject } from '@angular/core';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  withProps,
  patchState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap, catchError, of, filter, exhaustMap } from 'rxjs';

import { BankAccount } from '@app/core/bank-account/bank-account.interface';
import { BankAccountService } from '@app/core/bank-account/bank-account.service';

export interface AccountsState {
  accounts: BankAccount[];
  loading: boolean;
  error: { name?: string; message?: string } | null;
}

export const initialAccountsState: AccountsState = {
  accounts: [],
  loading: false,
  error: null,
};

export const AccountsStore = signalStore(
  { providedIn: 'root' },

  // Provide dependencies
  withProps(() => ({
    bankAccountService: inject(BankAccountService),
  })),

  // State
  // Gives you store.accounts() store.loading()
  withState(initialAccountsState),

  // Adds derived state (like selectors)
  withComputed((store) => ({
    hasAccounts: computed(() => store.accounts().length > 0),
  })),

  // Equivalent of: dispatch(loadAccounts) -> effect -> success/error actions
  withMethods((store) => ({
    load: rxMethod<void>(
      pipe(
        filter(() => !store.loading() && store.accounts().length === 0),
        tap(() => patchState(store, { loading: true, error: null })),
        exhaustMap(() =>
          // ignores new triggers while one is in progress
          store.bankAccountService.getBankAccounts().pipe(
            tap((accounts) => {
              patchState(store, { accounts, loading: false });
              console.log('Accounts loaded:', accounts);
            }),
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
  }))
);
