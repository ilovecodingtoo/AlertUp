import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { LocationService } from '../../services/location.service';
import { Router, RouterLink } from '@angular/router';
import { MatRadioModule } from '@angular/material/radio';
import { MapInfoWindow, MapMarker, GoogleMapsModule } from '@angular/google-maps';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { StatusService } from '../../services/status.service';


@Component({
  selector: 'app-alert-form',
  imports: [
    GoogleMapsModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatDialogModule,
    RouterLink
  ],
  templateUrl: './alert-form.component.html',
  styleUrl: './alert-form.component.css'
})
export class AlertFormComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly dialog = inject(MatDialog);
  form: FormGroup;
  showDisclaimer = true;
  made_by = '';
  center: any = null;
  watchId = 0;
  isInfoWindowOpen = false;
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow | undefined;
  @ViewChild('newAlert') newAlert!: any;

  constructor(private location: LocationService, private router: Router, private auth: AuthService, private fb: FormBuilder, public status: StatusService) {
    this.form = this.fb.group(
      {
        title: ['', [Validators.required, Validators.maxLength(35)]],
        description: ['', [Validators.required]],
        type: ['fire', [Validators.required]]
      }
    );
  }

  ngOnInit() {
    if(this.locationAccessAllowed()){
      this.watchId = navigator.geolocation.watchPosition(
        position => { this.center = { lat: position.coords.latitude, lng: position.coords.longitude }; },
        () => { this.status.setMessage('Posizione non disponibile', false); },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    }
    this.auth.getUserInfo().subscribe({
      next: (data: any) => { this.made_by = data.nickname; },
      error: () => { this.status.setMessage('Errore di connessione', false); }
    });
  }

  ngAfterViewInit() { setTimeout(() => { if(this.center && this.newAlert && this.infoWindow) this.openInfoWindow(this.newAlert); }, 2000); }

  locationAccessAllowed() { return this.location.locationAccessAllowed; }

  openTypeDialog() { this.dialog.open(TypeInfoComponent); }

  openInfoWindow(marker: MapMarker) {
    this.infoWindow?.open(marker);
    this.isInfoWindowOpen = true;
  }

  onMapClick() {
    if (this.isInfoWindowOpen) {
      this.infoWindow?.close();
      this.isInfoWindowOpen = false;
    }
  }
  
  onSubmit() {
    if(this.form.valid) this.auth.postAlert(this.form.value).subscribe({
      next: () => {
        this.status.setMessage('Segnalazione creata', true);
        this.router.navigate(['/alert-form']);
      },
      error: () => { this.status.setMessage('Errore di connessione', false); }
    });
  }

  ngOnDestroy() { navigator.geolocation.clearWatch(this.watchId); }
}


@Component({
  selector: 'app-dialog',
  template: `
    <mat-dialog-content>
      <p><strong>Fuoco (<span class='fas fa-fire' style="color: red;"></span>):</strong> indica situazioni legate al fuoco, come incendi 
      spontanei, oppure fenomeni a tema alte temperature, come le isole di calore urbane o le ondate di calore.</p>
      <p><strong>Acqua (<span class='fas fa-tint' style="color: rgb(0, 115, 255);"></span>):</strong> indica emergenze a rischio idrico, 
      come l'alta marea, forti piogge, un corso d'acqua contaminato da rifiuti chimici, lo straripamento di un fiume eccetera.</p>
      <p><strong>Aria (<span class='fas fa-wind' style="color: rgb(151, 151, 151);"></span>):</strong> indica fenomeni meteorologici estremi, come 
      forti raffiche di vento, tempeste violente, tornado, uragani, oppure situazioni di inquinamento dell'aria come smog fitto.</p>
      <p><strong>Ghiaccio (<span class='far fa-snowflake' style="color: aqua;"></span>):</strong> indica fenomeni meteorologici estremi a sfondo basse 
      temperature, come bufere di neve, grandine grossa, strade ghiacciate, valanghe, gelicidi eccetera.</p>
      <p><strong>Suolo (<span class='fas fa-house-damage' style="color: #8d4f26ff;"></span>):</strong> indica quegli eventi che hanno a che fare 
      con la stabilità del terreno, come i terremoti e le frane, più situazioni che possono complicare la mobilità, come le colate di fango.</p>
    </mat-dialog-content>
  `,
  imports: [MatDialogModule]
})
export class TypeInfoComponent {}