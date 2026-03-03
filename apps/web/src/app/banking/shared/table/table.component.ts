import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';

import { ExtendedTransaction } from '@app/core/transaction/transaction.interface';
import { AccountFieldComponent } from '../account-field/account-field.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  imports: [MatChipsModule, MatTableModule, CurrencyPipe, TitleCasePipe, AccountFieldComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent {
  @Input({ required: true }) transactions: ExtendedTransaction[] = [];

  displayedColumns = ['type', 'amount', 'source', 'target', 'description'];
}
