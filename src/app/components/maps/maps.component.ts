import { Component, OnInit, OnDestroy, ViewChild, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { LocationService } from '../../services/location.service';
import { Router, RouterLink } from '@angular/router';
import { MapInfoWindow, MapMarker, GoogleMapsModule } from '@angular/google-maps';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { StatusService } from '../../services/status.service';
declare const google: any;


@Component({
  selector: 'app-maps',
  imports: [CommonModule, RouterLink, GoogleMapsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './maps.component.html',
  styleUrl: './maps.component.css'
})
export class MapsComponent implements OnInit, AfterViewInit, OnDestroy {
  currentSlideIndex = -1;
  saved_locations: any[] = [];
  form: FormGroup;

  label = '';
  conditionType = '';
  conditionIconurl = '';
  backgroundImage = '';
  temperature = 0;

  center: any = null;
  watchId = 0;
  watchPosition: any = null;
  markers: any[] = [];
  selectedMarker: any = null;
  isInfoWindowOpen = false;
  @ViewChildren(MapMarker) markerRefs!: QueryList<MapMarker>;
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow | undefined;
  @ViewChild('mapRef') mapRef: any;
  @ViewChild('autocomplete') autocomplete!: any;

  constructor(private router: Router, private location: LocationService, private auth: AuthService, private fb: FormBuilder, public status: StatusService) {
    this.form = this.fb.group(
      {
        label: ['', [Validators.required, Validators.maxLength(20)]],
        address: ['', Validators.required],
        lat: [''],
        lng: ['']
      }
    );
  }

  ngOnInit() {
    if(this.locationAccessAllowed()){
      this.getAllMarkers();
      this.watchId = navigator.geolocation.watchPosition(
        position => {
          this.watchPosition = { lat: position.coords.latitude, lng: position.coords.longitude };
          this.getCurrentSlideData();
        },
        () => { this.status.setMessage('Posizione non disponibile', false); },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    }
    if(this.userLoggedIn()) this.getSavedLocations();
  }

  ngAfterViewInit() {
    if(this.locationAccessAllowed()) (async () => {
      const { Autocomplete } = await google.maps.importLibrary("places") as google.maps.PlacesLibrary;
      const autocomplete = new google.maps.places.Autocomplete(this.autocomplete.nativeElement, { fields: ['geometry'] });
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if(!place.geometry?.location) return;
        this.form.get('lat')?.setValue(place.geometry.location.lat());
        this.form.get('lng')?.setValue(place.geometry.location.lng());
      });
    })();
  }

  locationAccessAllowed() { return this.location.locationAccessAllowed; }

  userLoggedIn() { return this.auth.userLoggedIn(); }

  private getAllMarkers() {
    this.location.getAllAlerts().subscribe({
      next: alerts => { this.markers = alerts; },
      error: () => { this.status.setMessage('Errore di connessione', false); }
    });
  }

  private getSavedLocations() {
    this.auth.getSavedLocations().subscribe({
      next: saved_locations => { this.saved_locations = saved_locations; },
      error: () => { this.status.setMessage('Errore di connessione', false); }
    });
  }

  previousSlide() {
    this.currentSlideIndex = this.currentSlideIndex === -1 ? this.saved_locations.length : this.currentSlideIndex - 1;
    this.getCurrentSlideData();
    if (this.mapRef?.googleMap) this.mapRef.googleMap.setZoom(15);
  }
  
  nextSlide() {
    this.currentSlideIndex = this.currentSlideIndex === this.saved_locations.length ? -1 : this.currentSlideIndex + 1;
    this.getCurrentSlideData();
    if (this.mapRef?.googleMap) this.mapRef.googleMap.setZoom(15);
  }

  private getCurrentSlideData() {
    if(this.currentSlideIndex === this.saved_locations.length){
      this.center = this.selectedMarker = null;
      this.temperature = 0;
      this.label = this.conditionType = this.conditionIconurl = this.backgroundImage = '';
      return;
    }
    else if(this.currentSlideIndex === -1){
      this.center = this.watchPosition;
      this.selectedMarker = null;
      this.label = 'Posizione attuale';
      this.getWeather();
    }
    else{
      this.center = this.saved_locations[this.currentSlideIndex].position;
      this.selectedMarker = null;
      this.label = this.saved_locations[this.currentSlideIndex].label;
      this.getWeather();
    }
  }

  private getWeather() {
    this.location.getWeather(this.center.lat, this.center.lng).subscribe({
      next: data => {
        if(['CLEAR', 'MOSTLY_CLEAR'].includes(data.weatherCondition.type)) this.backgroundImage = 'linear-gradient(to bottom, #0ca5e2, transparent)';
        else if(['THUNDERSTORM', 'THUNDERSHOWER', 'LIGHT_THUNDERSTORM_RAIN', 'SCATTERED_THUNDERSTORMS', 'HEAVY_THUNDERSTORM'].includes(data.weatherCondition.type))
          this.backgroundImage = 'linear-gradient(to bottom, #0c3e52, transparent)';
        else if(['PARTLY_CLOUDY', 'MOSTLY_CLOUDY', 'CLOUDY', 'WINDY', 'WIND_AND_RAIN', 'LIGHT_RAIN_SHOWERS', 'CHANCE_OF_SHOWERS', 'SCATTERED_SHOWERS', 'RAIN_SHOWERS',
          'HEAVY_RAIN_SHOWERS', 'LIGHT_TO_MODERATE_RAIN', 'MODERATE_TO_HEAVY_RAIN', 'RAIN', 'LIGHT_RAIN', 'HEAVY_RAIN', 'RAIN_PERIODICALLY_HEAVY'].includes(data.weatherCondition.type))
          this.backgroundImage = 'linear-gradient(to bottom, #757575ff, transparent)';
        else this.backgroundImage = 'linear-gradient(to bottom, #79aac4, transparent)';
        if(data.weatherCondition.type === 'CLEAR' || data.weatherCondition.type === 'MOSTLY_CLEAR') this.conditionType = 'Sereno';
        else if(data.weatherCondition.type === 'PARTLY_CLOUDY') this.conditionType = 'Parzialmente nuvoloso';
        else if(data.weatherCondition.type === 'MOSTLY_CLOUDY' || data.weatherCondition.type === 'CLOUDY') this.conditionType = 'Nuvoloso';
        else if(data.weatherCondition.type === 'WINDY') this.conditionType = 'Ventoso';
        else if(data.weatherCondition.type === 'WIND_AND_RAIN') this.conditionType = 'Vento e pioggia';
        else if(data.weatherCondition.type === 'LIGHT_RAIN_SHOWERS' || data.weatherCondition.type === 'LIGHT_TO_MODERATE_RAIN' || data.weatherCondition.type === 'LIGHT_RAIN') this.conditionType = 'Pioggia leggera';
        else if(data.weatherCondition.type === 'RAIN_SHOWERS' || data.weatherCondition.type === 'RAIN') this.conditionType = 'Pioggia';
        else if(data.weatherCondition.type === 'CHANCE_OF_SHOWERS') this.conditionType = 'Probabilità di pioggia';
        else if(data.weatherCondition.type === 'SCATTERED_SHOWERS') this.conditionType = 'Pioggia a intermittenza';
        else if(data.weatherCondition.type === 'HEAVY_RAIN_SHOWERS' || data.weatherCondition.type === 'MODERATE_TO_HEAVY_RAIN' || data.weatherCondition.type === 'HEAVY_RAIN' || data.weatherCondition.type === 'RAIN_PERIODICALLY_HEAVY') this.conditionType = 'Forti piogge';
        else if(data.weatherCondition.type === 'CHANCE_OF_SNOW_SHOWERS') this.conditionType = 'Probabilità di neve';
        else if(data.weatherCondition.type === 'SCATTERED_SNOW_SHOWERS') this.conditionType = 'Neve a intermittenza';
        else if(data.weatherCondition.type === 'LIGHT_SNOW_SHOWERS' || data.weatherCondition.type === 'LIGHT_TO_MODERATE_SNOW' || data.weatherCondition.type === 'LIGHT_SNOW') this.conditionType = 'Nevicate leggere';
        else if(data.weatherCondition.type === 'SNOW' || data.weatherCondition.type === 'SNOW_SHOWERS') this.conditionType = 'Neve';
        else if(data.weatherCondition.type === 'BLOWING_SNOW') this.conditionType = 'Neve e vento';
        else if(data.weatherCondition.type === 'RAIN_AND_SNOW') this.conditionType = 'Neve e pioggia';
        else if(data.weatherCondition.type === 'HEAVY_SNOW_SHOWERS' || data.weatherCondition.type === 'MODERATE_TO_HEAVY_SNOW' || data.weatherCondition.type === 'HEAVY_SNOW' || data.weatherCondition.type === 'SNOW_PERIODICALLY_HEAVY' || data.weatherCondition.type === 'HEAVY_SNOW_STORM' || data.weatherCondition.type === 'SNOWSTORM') this.conditionType = 'Forti nevicate';
        else if(data.weatherCondition.type === 'HAIL' || data.weatherCondition.type === 'HAIL_SHOWERS') this.conditionType = 'Grandine';
        else if(data.weatherCondition.type === 'THUNDERSHOWER') this.conditionType = 'Acquazzone';
        else if(data.weatherCondition.type === 'THUNDERSTORM' || data.weatherCondition.type === 'LIGHT_THUNDERSTORM_RAIN' || data.weatherCondition.type === 'SCATTERED_THUNDERSTORMS' || data.weatherCondition.type === 'HEAVY_THUNDERSTORM') this.conditionType = 'Temporale';
        this.conditionIconurl = data.isDaytime ? data.weatherCondition.iconBaseUri + '.svg' : data.weatherCondition.iconBaseUri + '_dark.svg';
        this.temperature = data.temperature.degrees;
      },
      error: () => { this.status.setMessage('Errore di connessione', false); }
    });
  }

  onMapClick() {
    if (this.isInfoWindowOpen) {
      this.infoWindow?.close();
      this.isInfoWindowOpen = false;
    }
  }

  openInfoWindow(index: number) {
    this.selectedMarker = this.markers[index];
    this.infoWindow?.open(this.markerRefs.toArray()[index]);
    this.isInfoWindowOpen = true;
  }

  goToAlertForm() { this.router.navigate(['/alert-form']); }

  onSubmit() {
    if(this.form.valid) this.auth.postSavedLocation(this.form.value).subscribe({
      next: () => {
        this.status.setMessage('Luogo salvato con successo', true);
        this.router.navigate(['/']);
      },
      error: () => { this.status.setMessage('Errore di connessione', false); }
    });
  }

  deleteSavedLocation(i: number) {
    this.auth.deleteSavedLocation(i).subscribe({
      next: () => {
        this.status.setMessage('Luogo rimosso con successo', true);
        this.router.navigate(['/']);
      },
      error: () => { this.status.setMessage('Errore di connessione', false); }
    });
  }

  ngOnDestroy() { navigator.geolocation.clearWatch(this.watchId); }
}