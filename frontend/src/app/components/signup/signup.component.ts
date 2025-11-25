import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { StatusService } from '../../services/status.service';

@Component({
  selector: 'app-signup',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    RouterLink
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  form: FormGroup;

  constructor(private router: Router, private auth: AuthService, private fb: FormBuilder, public status: StatusService) {
    this.form = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        nickname: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(16)]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
        termsAndConditionsAccepted: [false, Validators.requiredTrue],
      },
      { validators: this.passwordMatchValidator }
    );
    this.form.get('email')?.valueChanges.subscribe(() => { if(this.form.get('email')?.hasError('emailTaken')) this.form.get('email')?.setErrors(null); });
    this.form.get('password')?.valueChanges.subscribe(() => { this.form.get('confirmPassword')?.updateValueAndValidity(); });
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if((!password || !confirmPassword) || (confirmPassword.errors && !confirmPassword.errors['passwordMismatch'])) return null;
    if(password.value !== confirmPassword.value) confirmPassword.setErrors({ passwordMismatch: true });
    else confirmPassword.setErrors(null);
    return null;
  }

  onSubmit() {
    if(this.form.valid) this.auth.signup(this.form.value).subscribe({
      next: () => {
        this.status.setMessage('Registrazione completata', true);
        this.router.navigate(['/login']);
      },
      error: err => {
        if(err.error === 'Email già registrata') this.form.get('email')?.setErrors({ emailTaken: true });
        else this.status.setMessage('Errore di connessione', false);
      }
    });
  }
}
