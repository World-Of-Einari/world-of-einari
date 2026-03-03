import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableComponent } from './table.component';
import { ExtendedTransaction, TransactionType } from '@app/core/transaction/transaction.interface';

const transactions: ExtendedTransaction[] = [
  {
    id: 1,
    transaction_type: TransactionType.DEPOSIT,
    amount: 100,
    source_bank_account_id: null,
    target_bank_account_id: 2,
    description: "Thomas' birthday present",
    target: {
      bank_name: 'Bank B',
      account_holder_name: 'account name',
      sort_code: '222222',
      account_number: '22222222',
    },
  },
];
describe(TableComponent.name, () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
  });

  it('should render', () => {
    component.transactions = transactions;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
