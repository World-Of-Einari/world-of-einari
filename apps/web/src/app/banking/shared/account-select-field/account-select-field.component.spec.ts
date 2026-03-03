import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverlayContainer } from '@angular/cdk/overlay';

import { BankAccount } from '@app/core/bank-account/bank-account.interface';
import { AccountSelectFieldComponent } from './account-select-field.component';

const mockAccounts: BankAccount[] = [
  {
    id: 1,
    bank_name: 'Bank A',
    account_holder_name: 'Miss Jane A Smith',
    sort_code: '111111',
    account_number: '11111111',
    client_id: 1,
    current_value: 128746.281,
  },
  {
    id: 2,
    bank_name: 'Bank B',
    account_holder_name: 'Thomas Christopher Wright',
    sort_code: '222222',
    account_number: '22222222',
    client_id: 2,
    current_value: 46.2,
  },
];

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, AccountSelectFieldComponent],
  template: `
    <app-account-select-field
      [accounts]="accounts"
      [label]="'Source account'"
      [formControl]="accountId" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class HostComponent {
  accountId = new FormControl<number | null>(null);
  accounts = mockAccounts;
}

describe('AccountSelectFieldComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let overlayElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const overlay = TestBed.inject(OverlayContainer);
    overlayElement = overlay.getContainerElement();
  });

  it('selecting an option updates the form control', async () => {
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const select = fixture.nativeElement.querySelector('mat-select') as HTMLElement;
    select.click();
    fixture.detectChanges();

    const options = overlayElement.querySelectorAll('mat-option');
    expect(options.length).toBe(2);

    (options[1] as HTMLElement).click();
    fixture.detectChanges();

    await fixture.whenStable();

    expect(fixture.componentInstance.accountId.value).toBe(2);
  });
});
