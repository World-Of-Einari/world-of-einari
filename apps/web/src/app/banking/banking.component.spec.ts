import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';

import {
  ExtendedTransaction,
  TransactionCreate,
  TransactionType,
} from '@app/core/transaction/transaction.interface';
import { BankingStore } from '@app/banking/core/store/banking.store';
import { BankingComponent } from './banking.component';

const mockTransactionCreate: TransactionCreate = {
  transaction_type: TransactionType.DEPOSIT,
  amount: 100,
  source_bank_account_id: null,
  target_bank_account_id: 2,
  description: "Thomas' birthday present",
};

const extendedTransactions: ExtendedTransaction[] = [
  {
    id: 1,
    transaction_type: TransactionType.DEPOSIT,
    amount: 100,
    source_bank_account_id: null,
    target_bank_account_id: 2,
    description: "Thomas' birthday present",
    target: {
      bank_name: 'Bank B',
      account_holder_name: 'Thomas Christopher Wright',
      sort_code: '222222',
      account_number: '22222222',
    },
    source: undefined,
  },
  {
    id: 2,
    transaction_type: TransactionType.TRANSFER,
    amount: 12502,
    source_bank_account_id: 1,
    target_bank_account_id: 5,
    description: 'Janes transfer',
    target: undefined,
    source: {
      bank_name: 'Bank A',
      account_holder_name: 'Miss Jane A Smith',
      sort_code: '111111',
      account_number: '11111111',
    },
  },
];

const load = jest.fn();
const create = jest.fn();

describe(BankingComponent.name, () => {
  let component: BankingComponent;
  let fixture: ComponentFixture<BankingComponent>;

  const extendedTransactionsSig = signal<ExtendedTransaction[]>([]);
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BankingComponent],
      providers: [
        {
          provide: MatDialog,
          useValue: {
            open: jest.fn().mockReturnValue({
              afterClosed: () => ({
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                subscribe: (callback: any) => callback(mockTransactionCreate),
              }),
            }),
          },
        },
        {
          provide: BankingStore,
          useValue: {
            extendedTransactions: extendedTransactionsSig,
            load: load,
            create: create,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BankingComponent);
    component = fixture.componentInstance;
  });

  it('should render empty state', () => {
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should render', () => {
    extendedTransactionsSig.set(extendedTransactions);
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch loadTransactions and loadAccounts on init', async () => {
    fixture.detectChanges();

    component.ngOnInit();

    expect(load).toHaveBeenCalled();
  });

  it('should dispatch createTransaction on create', () => {
    component.create();

    expect(create).toHaveBeenCalledWith(mockTransactionCreate);
  });
});
