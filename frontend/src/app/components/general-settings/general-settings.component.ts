import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { LocationService } from '../../services/location.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { StatusService } from '../../services/status.service';


@Component({
  selector: 'app-general-settings',
  imports: [CommonModule, MatSlideToggleModule],
  templateUrl: './general-settings.component.html',
  styleUrl: './general-settings.component.css'
})
export class GeneralSettingsComponent {
  @ViewChild('locationToggle') locationToggle: any;
  @ViewChild('pushToggle') pushToggle: any;

  constructor(public location: LocationService, public auth: AuthService, private router: Router, public status: StatusService) {}

  userLoggedIn() { return this.auth.userLoggedIn(); }

  goToAccountSettings() { this.router.navigate(['/account-settings']); }

  goToTermsAndConditions() { this.router.navigate(['/terms-and-conditions']); }

  toggleLocationAccess() {
    if (this.location.locationAccessAllowed) {
      this.location.locationAccessAllowed = false;
      localStorage.setItem('locationAccessAllowed', JSON.stringify(false));
      this.locationToggle.checked = false;
    } else {
      if (navigator.geolocation)
        navigator.geolocation.getCurrentPosition(
          () => {
            this.location.locationAccessAllowed = true;
            localStorage.setItem('locationAccessAllowed', JSON.stringify(true));
          },
          () => {
            this.locationToggle.checked = false;
            this.status.setMessage('Posizione non disponibile', false);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
        );
    }
  }

  togglePushNotifications() { if(!this.auth.togglepushNotifications()) this.pushToggle.checked = false; }
}
