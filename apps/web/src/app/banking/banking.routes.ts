import { Routes } from '@angular/router';
import { BankingStore } from './core/store/banking.store';

export const bankingRoutes: Routes = [
  {
    path: '',
    providers: [BankingStore /* Accounts and Transactions store are provided in root */],
    loadComponent: () => import('./banking.component').then((m) => m.BankingComponent),
  },
];
