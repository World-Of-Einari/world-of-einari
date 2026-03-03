import { FormControl } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { AmountInputFieldComponent } from './amount-input-field.component';

describe(AmountInputFieldComponent.name, () => {
  let component: AmountInputFieldComponent;
  let fixture: ComponentFixture<AmountInputFieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AmountInputFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AmountInputFieldComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('toggles amount field and validators when withdraw full value is toggled', () => {
    component.amountControl = new FormControl<number | null>(null);
    component.withdrawFullValueControl = new FormControl<boolean>(false, { nonNullable: true });
    component.balance$ = of(100);

    fixture.detectChanges();

    expect(component.showAmount).toBeTruthy();
    expect(component.amountControl.enabled).toBeTruthy();

    component.withdrawFullValueControl.setValue(true);
    fixture.detectChanges();

    expect(component.showAmount).toBeFalsy();
    expect(component.amountControl.disabled).toBeTruthy();
  });

  it('resets amount field when withdraw full value is toggled off', () => {
    component.amountControl = new FormControl<number | null>(50);
    component.withdrawFullValueControl = new FormControl<boolean>(true, { nonNullable: true });
    component.balance$ = of(100);

    fixture.detectChanges();

    expect(component.amountControl.value).toBe(100);

    component.withdrawFullValueControl.setValue(false);
    fixture.detectChanges();

    expect(component.amountControl.value).toBeNull();
  });
});
