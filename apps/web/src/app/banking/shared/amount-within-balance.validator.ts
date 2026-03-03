import { DestroyRef, Directive, Input, forwardRef, inject } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  NG_ASYNC_VALIDATORS,
  ValidationErrors,
} from '@angular/forms';
import { Observable, distinctUntilChanged, filter, map, of, take } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[amountWithinBalance]',
  standalone: true,
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => AmountWithinBalanceValidatorDirective),
      multi: true,
    },
  ],
})
export class AmountWithinBalanceValidatorDirective implements AsyncValidator {
  private readonly destroyRef = inject(DestroyRef);

  private onValidatorChange?: () => void;
  private balanceSrc$?: Observable<number | null>;
  private enabledSrc = true;

  @Input({ required: true })
  set balance$(value: Observable<number | null>) {
    this.balanceSrc$ = value;

    value
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.onValidatorChange?.());
  }

  @Input()
  set enabled(value: boolean) {
    this.enabledSrc = value;
    this.onValidatorChange?.();
  }
  get enabled(): boolean {
    return this.enabledSrc;
  }

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!this.enabledSrc) return of(null);

    const rawValue = control.value;

    const amount = typeof rawValue === 'number' ? rawValue : Number(rawValue);
    if (!rawValue || !Number.isFinite(amount) || amount <= 0) return of(null);

    if (!this.balanceSrc$) return of(null);

    return this.balanceSrc$.pipe(
      take(1),
      filter((balance) => balance != null),
      map((balance) => (amount > balance ? { insufficientFunds: { amount, balance } } : null))
    );
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }
}
