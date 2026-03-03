import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { combineLatest, filter, map, shareReplay, startWith } from 'rxjs';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

import { AccountSelectFieldComponent } from '../account-select-field/account-select-field.component';
import { AmountInputFieldComponent } from '../amount-input-field/amount-input-field.component';
import { AccountsStore } from '@app/banking/core/store/accounts.store';

interface CreateTransactionForm {
  transaction_type: FormControl<string>;
  withdraw_full_value: FormControl<boolean>;
  amount: FormControl<number | null>;
  source_bank_account_id: FormControl<number | null>;
  target_bank_account_id: FormControl<number | null>;
  description: FormControl<string>;
}

@Component({
  selector: 'app-create-transaction-form',
  templateUrl: './create-transaction-form.component.html',
  styleUrls: ['./create-transaction-form.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    AccountSelectFieldComponent,
    AmountInputFieldComponent,
  ],
})
export class CreateTransactionFormComponent implements OnInit {
  dialog = inject(MatDialogRef);
  store = inject(AccountsStore);

  transactionTypes = [
    { value: 'DEPOSIT', label: 'Deposit' },
    { value: 'WITHDRAW', label: 'Withdraw' },
    { value: 'TRANSFER', label: 'Transfer' },
  ];

  // Display toggles
  showSourceAccount = false;
  showTargetAccount = false;
  showAmount = false;
  showDescription = false;
  showWithdrawFullValueToggle = false;

  form = new FormGroup<CreateTransactionForm>({
    transaction_type: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    withdraw_full_value: new FormControl(false, { nonNullable: true }),
    amount: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(0.01)],
    }),
    source_bank_account_id: new FormControl<number | null>(null),
    target_bank_account_id: new FormControl<number | null>(null),
    description: new FormControl('', { nonNullable: true }),
  });

  // Form fields
  transactionTypeField = this.form.controls.transaction_type;
  withdrawFullValueField = this.form.controls.withdraw_full_value;
  amountField = this.form.controls.amount;
  sourceAccountField = this.form.controls.source_bank_account_id;
  targetAccountField = this.form.controls.target_bank_account_id;
  descriptionField = this.form.controls.description;

  accounts = this.store.accounts;

  targetAccounts$ = combineLatest([
    toObservable(this.accounts),
    this.sourceAccountField.valueChanges.pipe(startWith(this.sourceAccountField.value)),
  ]).pipe(
    map(([accounts, sourceAccountId]) => {
      if (sourceAccountId == null) return accounts;

      const sourceAccount = accounts.find((a) => a.id === sourceAccountId);
      const returnable = accounts.filter(
        ({ id, client_id }) => id !== sourceAccountId && client_id === sourceAccount?.client_id
      );

      if (returnable.length === 0) {
        this.targetAccountField.setErrors({
          noValidTargetAccounts:
            'No valid target accounts available for the selected source account.',
        });
      } else {
        this.targetAccountField.setErrors(null);
      }
      return returnable;
    })
  );

  // Finds the right balance based on selected source account.
  balance$ = combineLatest([
    toObservable(this.accounts),
    this.sourceAccountField.valueChanges.pipe(startWith(this.sourceAccountField.value)),
  ]).pipe(
    map(([accounts, sourceAccountId]) => {
      if (sourceAccountId == null) return null;
      const sourceAccount = accounts.find((a) => a.id === sourceAccountId);
      return sourceAccount?.current_value ?? null;
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  // Decide when to enable validation for the amount field
  validationEnabled$ = this.transactionTypeField.valueChanges.pipe(
    startWith(this.transactionTypeField.value),
    map((t) => t === 'WITHDRAW' || t === 'TRANSFER'),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  private readonly destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.transactionTypeField.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((type) => !!type)
      )
      .subscribe((type) => {
        this.resetFieldsForTransactionType();
        this.showDescription = true;
        this.showAmount = true;
        this.showWithdrawFullValueToggle = false;
        this.amountField.enable();

        if (type === 'DEPOSIT') {
          this.showSourceAccount = false;
          this.sourceAccountField.disable();

          this.showTargetAccount = true;
          this.targetAccountField.enable();
          this.targetAccountField.setValidators(Validators.required);

          this.showDescription = true;
          this.descriptionField.enable();
        } else if (type === 'WITHDRAW') {
          this.showSourceAccount = true;
          this.sourceAccountField.enable();
          this.sourceAccountField.setValidators(Validators.required);

          this.showTargetAccount = false;
          this.targetAccountField.disable();

          this.showWithdrawFullValueToggle = true;
          this.withdrawFullValueField.setValue(false, { emitEvent: false });
        } else if (type === 'TRANSFER') {
          this.showSourceAccount = true;
          this.sourceAccountField.enable();
          this.sourceAccountField.setValidators(Validators.required);

          this.showTargetAccount = true;

          this.targetAccountField.setValidators(Validators.required);
        }
      });

    // Refresh amount field validation
    this.validationEnabled$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.amountField.updateValueAndValidity({ onlySelf: true });
    });

    this.sourceAccountField.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((sourceAccountId) => {
        const type = this.transactionTypeField.value;

        if (type !== 'TRANSFER') return;

        if (sourceAccountId == null) {
          this.targetAccountField.disable();
        } else {
          this.targetAccountField.enable();
        }
      });
  }

  submit() {
    this.dialog.close(this.form.getRawValue());
  }

  cancel() {
    this.dialog.close();
  }

  private resetFieldsForTransactionType() {
    this.amountField.reset(null, { emitEvent: false });
    this.withdrawFullValueField.setValue(false, { emitEvent: false });
    this.sourceAccountField.reset(null, { emitEvent: false });
    this.targetAccountField.reset(null, { emitEvent: false });
    this.descriptionField.reset('', { emitEvent: false });
  }
}
