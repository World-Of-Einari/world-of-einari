import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BankAccount } from './bank-account.interface';

@Injectable({
  providedIn: 'root',
})
export class BankAccountService {
  private http = inject(HttpClient);

  getBankAccounts() {
    return this.http.get<BankAccount[]>('/api/bank_accounts');
  }
}
