import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NestedBankAccount } from '@app/core/bank-account/bank-account.interface';

@Component({
  selector: 'app-account-field',
  templateUrl: './account-field.component.html',
  styleUrls: ['./account-field.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountFieldComponent {
  @Input({ required: true }) account?: NestedBankAccount;
}
