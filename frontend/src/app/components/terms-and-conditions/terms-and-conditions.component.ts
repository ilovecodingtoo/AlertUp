import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Browser } from '@capacitor/browser';


@Component({
  selector: 'app-terms-and-conditions',
  imports: [],
  templateUrl: './terms-and-conditions.component.html',
  styleUrl: './terms-and-conditions.component.css'
})
export class TermsAndConditionsComponent {
  constructor(private router: Router) {}

  async openProtezioneCivileWebsite(): Promise<void> {
    try {
      await Browser.open({ url: 'https://emergenze.protezionecivile.gov.it/it/' });
    } catch (error) {
      window.open('https://emergenze.protezionecivile.gov.it/it/', '_system');
    }
  }

  goToGeneralSettings() { this.router.navigate(['/general-settings']); }
}
