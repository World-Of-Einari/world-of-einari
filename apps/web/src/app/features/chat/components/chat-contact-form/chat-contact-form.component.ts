import { ChangeDetectionStrategy, Component, inject, OnInit, output, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

@Component({
  selector: 'en-chat-contact-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chat-contact-form.component.html',
  styleUrl: './chat-contact-form.component.scss',
})
export class ChatContactFormComponent implements OnInit {
  readonly formOpen = signal(false);
  readonly formSubmit = output<ContactFormData>();

  private fb = inject(FormBuilder);

  form!: FormGroup;

  ngOnInit() {
    this.form = this.fb.nonNullable.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
      consent: [false, Validators.requiredTrue],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.formSubmit.emit(this.form.getRawValue());
    this.formOpen.set(true);
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control?.touched);
  }
}
