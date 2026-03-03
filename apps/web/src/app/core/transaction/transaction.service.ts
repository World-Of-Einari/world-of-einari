import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Transaction, TransactionCreate } from './transaction.interface';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private http = inject(HttpClient);

  getTransactions() {
    return this.http.get<Transaction[]>('/api/transactions');
  }

  createTransaction(data: TransactionCreate) {
    return this.http.post<Transaction>('/api/transactions', data);
  }
}
