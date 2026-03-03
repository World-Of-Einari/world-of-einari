/// <reference types="jest" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountFieldComponent } from './account-field.component';

describe('AccountFieldComponent', () => {
  let fixture: ComponentFixture<AccountFieldComponent>;
  let component: AccountFieldComponent;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountFieldComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountFieldComponent);
    component = fixture.componentInstance;
  });

  it('should render an account field correctly', () => {
    component.account = {
      bank_name: 'Bank A',
      account_holder_name: 'Miss Jane A Smith',
      sort_code: '111111',
      account_number: '11111111',
    };

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should render an empty state correctly', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
