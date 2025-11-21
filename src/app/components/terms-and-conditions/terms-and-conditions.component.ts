import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-terms-and-conditions',
  imports: [],
  templateUrl: './terms-and-conditions.component.html',
  styleUrl: './terms-and-conditions.component.css'
})
export class TermsAndConditionsComponent {
  constructor(private router: Router) {}

  goToGeneralSettings() { this.router.navigate(['/general-settings']); }
}
