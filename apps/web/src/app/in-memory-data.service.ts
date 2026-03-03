import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { BankAccount } from './core/bank-account/bank-account.interface';
import { Transaction, TransactionType } from './core/transaction/transaction.interface';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const bank_accounts: BankAccount[] = [
      {
        id: 1,
        bank_name: 'Bank A',
        account_holder_name: 'Miss Jane A Smith',
        sort_code: '111111',
        account_number: '11111111',
        client_id: 1,
        current_value: 128746.281,
      },
      {
        id: 2,
        bank_name: 'Bank B',
        account_holder_name: 'Thomas Christopher Wright',
        sort_code: '222222',
        account_number: '22222222',
        client_id: 2,
        current_value: 46.2,
      },
      {
        id: 3,
        bank_name: 'Bank C',
        account_holder_name: 'Mr John Doe',
        sort_code: '333333',
        account_number: '33333333',
        client_id: 3,
        current_value: 123.82,
      },
      {
        id: 4,
        bank_name: 'Bank D',
        account_holder_name: 'Mr T Wright',
        sort_code: '444444',
        account_number: '44444444',
        client_id: 2,
        current_value: 325480.82,
      },
      {
        id: 5,
        bank_name: 'Bank E',
        account_holder_name: 'Jane Alexandra Smith',
        sort_code: '555555',
        account_number: '55555555',
        client_id: 1,
        current_value: 0,
      },
    ];

    const transactions: Transaction[] = [
      {
        id: 1,
        transaction_type: TransactionType.DEPOSIT,
        amount: 100,
        source_bank_account_id: null,
        target_bank_account_id: 2,
        description: "Thomas' birthday present",
      },
      {
        id: 2,
        transaction_type: TransactionType.TRANSFER,
        amount: 12502,
        source_bank_account_id: 1,
        target_bank_account_id: 5,
        description: 'Janes transfer',
      },
      {
        id: 3,
        transaction_type: TransactionType.WITHDRAW,
        amount: 325480.82,
        source_bank_account_id: 4,
        target_bank_account_id: null,
        description: 'Closing account',
      },
      {
        id: 4,
        transaction_type: TransactionType.DEPOSIT,
        amount: 35.5,
        source_bank_account_id: null,
        target_bank_account_id: 3,
        description: 'Repayment to John',
      },
    ];

    return { bank_accounts, transactions };
  }
}
