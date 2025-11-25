import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, EmailValidator } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { StatusService } from '../../services/status.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';


@Component({
  selector: 'app-account-settings',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule
  ],
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.css'
})
export class AccountSettingsComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  userInfo: any = null;
  emailform: FormGroup;
  nicknameform: FormGroup;
  passwordform: FormGroup;
  emailEnabled = false;
  nicknameEnabled = false;
  passwordEnabled = false;

  constructor(private router: Router, private auth: AuthService, private fb: FormBuilder, public status: StatusService) {
    this.emailform = this.fb.group(
      { email: [{ value: '', disabled: true }, [Validators.required, Validators.email]] },
      { validators: this.currentEmailValidator() }
    );
    this.nicknameform = this.fb.group({ nickname: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(4), Validators.maxLength(16)]] });
    this.passwordform = this.fb.group({ password: [{ value: '        ', disabled: true }, [Validators.required, Validators.minLength(8)]] });
    this.emailform.get('email')?.valueChanges.subscribe(() => { if(this.emailform.get('email')?.hasError('emailTaken')) this.emailform.get('email')?.setErrors(null); });
  }

  currentEmailValidator() {
    return (control: AbstractControl) => {
      const emailControl = control.get('email');
      if(!emailControl || !this.userInfo?.email) return null;
      const currentEmail = this.userInfo.email;
      const newEmail = emailControl.value;
      if(newEmail && newEmail === currentEmail){
        emailControl.setErrors({ ...emailControl.errors, currentEmail: true });
        return { currentEmail: true };
      }else{
        if(emailControl.hasError('currentEmail')){
          const errors = { ...emailControl.errors };
          delete errors['currentEmail'];
          emailControl.setErrors(Object.keys(errors).length > 0 ? errors : null);
        }
        return null;
      }
    };
  }

  ngOnInit() {
    this.auth.getUserInfo().subscribe({
      next: (userInfo: any) => {
      this.userInfo = userInfo;
      this.emailform.get('email')?.setValue(this.userInfo.email);
      this.nicknameform.get('nickname')?.setValue(this.userInfo.nickname);
      },
      error: () => { this.status.setMessage('Errore di connessione', false); }
    });
  }

  enableEmail() {
    this.emailEnabled = true;
    this.emailform.get('email')?.enable();
  }

  enableNickname() {
    this.nicknameEnabled = true;
    this.nicknameform.get('nickname')?.enable();
  }

  enablePassword() {
    this.passwordEnabled = true;
    this.passwordform.get('password')?.enable();
  }

  onEmailSubmit() {
    if(this.emailform.valid) this.auth.updateUserData(this.emailform.value).subscribe({
      next: () => {
        this.status.setMessage('Email aggiornata', true);
        this.router.navigate(['/account-settings']);
      },
      error: err => {
        if(err.error.message === 'Email già registrata') this.emailform.get('email')?.setErrors({ emailTaken: true });
        else this.status.setMessage('Errore di connessione', false);
      }
    })
  }

  onNicknameSubmit() {
    if(this.nicknameform.valid) this.auth.updateUserData(this.nicknameform.value).subscribe({
      next: () => {
        this.status.setMessage('Nickname aggiornato', true);
        this.router.navigate(['/account-settings']);
      },
      error: () => { this.status.setMessage('Errore di connessione', false); }
    })
  }

  onPasswordSubmit() {
    if(this.passwordform.valid) this.auth.updateUserData(this.passwordform.value).subscribe({
      next: () => {
        this.status.setMessage('Password aggiornata', true);
        this.router.navigate(['/account-settings']);
      },
      error: () => { this.status.setMessage('Errore di connessione', false); }
    })
  }

  goToGeneralSettings() { this.router.navigate(['/general-settings']); }

  openDeleteAccountDialog() { this.dialog.open(DeleteAccountComponent); }
}


@Component({
  selector: 'app-dialog',
  template: `
    <mat-dialog-content>
      <p>
        Prima di procedere, ti informiamo che l'eliminazione del tuo account è un'azione <strong>irreversibile</strong> che comporta la cancellazione <strong>permanente</strong> di tutti i tuoi dati personali e 
        dei contenuti che hai creato, e, di conseguenza, l'<strong>impossibilità</strong> di recuperarli in futuro.
        <br><br>Una volta confermata, la decisione <strong>non</strong> può essere annullata.<br><br>
        Nota che, ad eliminazione avvenuta, potrai riutilizzare la stessa mail per crearne un nuovo account.
      </p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button class="w3-button w3-round-large w3-white" style="outline: none; border: none;" mat-dialog-close>Annulla</button>
      <button class="w3-button w3-round-large w3-danger" style="outline: none; border: none;" mat-dialog-close (click)="deleteAccount()">Elimina account</button>
    </mat-dialog-actions>
  `,
  imports: [MatDialogModule]
})
export class DeleteAccountComponent {
  constructor(private auth: AuthService, public status: StatusService, private router: Router) {}

  deleteAccount() {
    this.auth.deleteAccount().subscribe({
      next: () => {
        this.status.setMessage('Account eliminato', true);
        this.auth.logout();
        this.router.navigate(['/general-settings']);
      },
      error: () => { this.status.setMessage('Errore di connessione', false); }
    });
  }
}