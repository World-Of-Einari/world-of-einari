import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';

import { CreateTransactionFormComponent } from './create-transaction-form.component';

import { AccountsStore } from '@app/banking/core/store/accounts.store';
import { BankAccount } from '@app/core/bank-account/bank-account.interface';
import { signal } from '@angular/core';

describe(CreateTransactionFormComponent.name, () => {
  let component: CreateTransactionFormComponent;
  let fixture: ComponentFixture<CreateTransactionFormComponent>;

  const accountsSig = signal<BankAccount[]>([]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CreateTransactionFormComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: jest.fn(),
          },
        },
        {
          provide: AccountsStore,
          useValue: {
            accounts: accountsSig,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateTransactionFormComponent);
    component = fixture.componentInstance;

    // for running ngOnInit
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('DEPOSIT: hides/disables source, shows/enables target and makes target required', async () => {
    component.transactionTypeField.setValue('DEPOSIT');

    fixture.detectChanges();
    expect(component.showSourceAccount).toBe(false);
    expect(component.sourceAccountField.disabled).toBe(true);

    expect(component.showTargetAccount).toBe(true);
    expect(component.targetAccountField.enabled).toBe(true);

    component.targetAccountField.setValue(null);
    component.targetAccountField.updateValueAndValidity();
    expect(component.targetAccountField.hasError('required')).toBe(true);

    expect(component.showAmount).toBe(true);
    expect(component.amountField.enabled).toBe(true);
    expect(component.showDescription).toBe(true);
  });

  it('WITHDRAW: shows/enables source, hides/disables target and makes source required', () => {
    component.transactionTypeField.setValue('WITHDRAW');

    fixture.detectChanges();
    expect(component.showSourceAccount).toBe(true);
    expect(component.sourceAccountField.enabled).toBe(true);

    expect(component.showTargetAccount).toBe(false);
    expect(component.targetAccountField.disabled).toBe(true);

    component.sourceAccountField.setValue(null);
    component.sourceAccountField.updateValueAndValidity();
    expect(component.sourceAccountField.hasError('required')).toBe(true);

    expect(component.showAmount).toBe(true);
    expect(component.amountField.enabled).toBe(true);
    expect(component.showDescription).toBe(true);
  });

  it('TRANSFER: shows/enables source and target, makes both required', async () => {
    component.transactionTypeField.setValue('TRANSFER');

    fixture.detectChanges();
    expect(component.showSourceAccount).toBe(true);
    expect(component.sourceAccountField.enabled).toBe(true);

    expect(component.showTargetAccount).toBe(true);
    expect(component.targetAccountField.enabled).toBe(false);

    component.sourceAccountField.setValue(null);
    component.sourceAccountField.updateValueAndValidity();
    expect(component.sourceAccountField.hasError('required')).toBe(true);

    component.targetAccountField.setValue(null);
    component.targetAccountField.updateValueAndValidity();

    expect(component.showAmount).toBe(true);
    expect(component.amountField.enabled).toBe(true);
    expect(component.showDescription).toBe(true);
  });

  it('TRANSFER: should enable target account field when source account is selected', async () => {
    accountsSig.set([
      {
        id: 1,
        bank_name: 'Bank A',
        account_holder_name: 'Miss Jane A Smith',
        sort_code: '111111',
        account_number: '11111111',
        client_id: 1,
        current_value: 128746.281,
      },
    ]);

    component.transactionTypeField.setValue('TRANSFER');
    fixture.detectChanges();

    expect(component.targetAccountField.disabled).toBe(true);

    component.sourceAccountField.setValue(1);
    fixture.detectChanges();

    expect(component.targetAccountField.enabled).toBe(true);
  });

  it('WITHDRAW: should handle amount validation', async () => {
    accountsSig.set([
      {
        id: 1,
        bank_name: 'Bank A',
        account_holder_name: 'Miss Jane A Smith',
        sort_code: '111111',
        account_number: '11111111',
        client_id: 1,
        current_value: 128746.281,
      },
    ]);

    component.transactionTypeField.setValue('WITHDRAW');
    fixture.detectChanges();

    component.sourceAccountField.setValue(1);
    fixture.detectChanges();

    component.amountField.setValue(200000);
    fixture.detectChanges();

    component.amountField.updateValueAndValidity();

    fixture.detectChanges();
    expect(component.amountField.hasError('insufficientFunds')).toBe(true);

    component.amountField.setValue(50000);
    component.amountField.updateValueAndValidity();

    fixture.detectChanges();
    expect(component.amountField.hasError('insufficientFunds')).toBe(false);
  });

  it('TRANSFER: should handle amount validation', async () => {
    accountsSig.set([
      {
        id: 1,
        bank_name: 'Bank A',
        account_holder_name: 'Miss Jane A Smith',
        sort_code: '111111',
        account_number: '11111111',
        client_id: 1,
        current_value: 128746.281,
      },
    ]);

    component.transactionTypeField.setValue('TRANSFER');
    fixture.detectChanges();

    component.sourceAccountField.setValue(1);
    fixture.detectChanges();

    component.amountField.setValue(200000);
    fixture.detectChanges();

    component.amountField.updateValueAndValidity();

    fixture.detectChanges();
    expect(component.amountField.hasError('insufficientFunds')).toBe(true);

    component.amountField.setValue(50000);
    component.amountField.updateValueAndValidity();

    fixture.detectChanges();
    expect(component.amountField.hasError('insufficientFunds')).toBe(false);
  });

  it('should reset fields when transaction type changes', async () => {
    component.transactionTypeField.setValue('DEPOSIT');
    fixture.detectChanges();

    component.sourceAccountField.setValue(1);
    component.targetAccountField.setValue(2);
    component.amountField.setValue(100);
    component.descriptionField.setValue('Test description');
    fixture.detectChanges();

    component.transactionTypeField.setValue('WITHDRAW');
    fixture.detectChanges();

    expect(component.sourceAccountField.value).toBeNull();
    expect(component.targetAccountField.value).toBeNull();
    expect(component.amountField.value).toBeNull();
    expect(component.descriptionField.value).toBe('');
  });
});
