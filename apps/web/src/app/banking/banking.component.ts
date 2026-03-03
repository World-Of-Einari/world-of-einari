import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { CreateTransactionFormComponent } from '@app/banking/shared/create-transaction-form/create-transaction-form.component';
import { TableComponent } from '@app/banking/shared/table/table.component';
import { BankingStore } from '@app/banking/core/store/banking.store';

@Component({
  selector: 'app-banking',
  templateUrl: './banking.component.html',
  styleUrls: ['./banking.component.scss'],
  imports: [TableComponent, MatButtonModule, MatCardModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankingComponent implements OnInit {
  dialog = inject(MatDialog);
  bankingStore = inject(BankingStore);

  extendedTransactions = this.bankingStore.extendedTransactions;

  ngOnInit() {
    this.bankingStore.load();
  }

  create() {
    this.dialog
      .open(CreateTransactionFormComponent, {
        width: '400px',
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.bankingStore.create(result);
        }
      });
  }
}
