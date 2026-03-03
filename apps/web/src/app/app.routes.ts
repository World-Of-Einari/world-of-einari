import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./banking/banking.routes').then((m) => m.bankingRoutes),
  },
];
