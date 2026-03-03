import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  forwardRef,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ControlValueAccessor,
  FormBuilder,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { BankAccount } from '@app/core/bank-account/bank-account.interface';

@Component({
  selector: 'app-account-select-field',
  templateUrl: './account-select-field.component.html',
  styleUrls: ['./account-select-field.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AccountSelectFieldComponent),
      multi: true,
    },
  ],
})
export class AccountSelectFieldComponent implements OnInit, ControlValueAccessor {
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);

  accounts = input<BankAccount[]>([]);
  label = input('');

  form = this.fb.group({
    account: this.fb.control<number | null>(null, Validators.required),
  });

  private accountControl = this.form.controls['account'];
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: number | null) => void = () => {}; // NG replaces this with the actual function (https://v17.angular.io/api/forms/ControlValueAccessor#example)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  ngOnInit() {
    this.accountControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((id: number | null) => {
        this.onChange(id);
      });
  }

  writeValue(value: number | null): void {
    this.form.controls['account'].setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: (value: number | null) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    const ctrl = this.form.controls['account'];
    if (isDisabled) {
      ctrl.disable({ emitEvent: false });
    } else {
      ctrl.enable({ emitEvent: false });
    }
  }

  markTouched() {
    this.onTouched();
  }
}
