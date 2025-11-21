import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class LocationService {
  googleMapsApiKey = environment.GOOGLE_MAPS_API_KEY;
  locationAccessAllowed = false;
  private baseApiUrl = environment.BASE_API_URL;

  constructor(private http: HttpClient, private router: Router) {}

  loadLocationAccessPermission() {
    const storedLocationAccessAllowed = localStorage.getItem('locationAccessAllowed');
    if(!storedLocationAccessAllowed) localStorage.setItem('locationAccessAllowed', JSON.stringify(false));
    else this.locationAccessAllowed = JSON.parse(storedLocationAccessAllowed);
  }

  getAllAlerts() { return this.http.get<any[]>(`${this.baseApiUrl}/alerts`, { headers: new HttpHeaders({ 'Cache-Control': 'no-cache' }) }); }

  getWeather(lat: number, lng: number) { return this.http.get<any>(`https://weather.googleapis.com/v1/currentConditions:lookup?key=${this.googleMapsApiKey}&location.latitude=${lat}&location.longitude=${lng}`); }
}
