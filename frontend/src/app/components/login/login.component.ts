import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { StatusService } from '../../services/status.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  form: FormGroup;

  constructor(private router: Router, private auth: AuthService, private fb: FormBuilder, public status: StatusService) {
    this.form = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]]
      }
    );
    this.form.get('email')?.valueChanges.subscribe(() => { if(this.form.get('email')?.hasError('InvalidEmail')) this.form.get('email')?.setErrors(null); });
    this.form.get('password')?.valueChanges.subscribe(() => { if(this.form.get('password')?.hasError('InvalidPassword')) this.form.get('password')?.setErrors(null); });
  }

  onSubmit() {
    if(this.form.valid) this.auth.login(this.form.get('email')?.value, this.form.get('password')?.value).subscribe({
      next: () => {
        this.status.setMessage('Accesso effettuato', true);
        this.router.navigate(['/']);
      },
      error: err => {
        if(err.error === 'Email non registrata') this.form.get('email')?.setErrors({ InvalidEmail: true });
        else if(err.error === 'Password errata') this.form.get('password')?.setErrors({ InvalidPassword: true });
        else this.status.setMessage('Errore di connessione', false);
      }
    });
  }
}
