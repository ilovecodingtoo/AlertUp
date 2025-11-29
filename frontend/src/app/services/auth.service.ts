import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocationService } from './location.service';
import { environment } from './../environments/environment';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token = '';
  private baseApiUrl = environment.BASE_API_URL;
  
  constructor(private http: HttpClient, private location: LocationService) {}

  loadToken() {
    const storedToken = localStorage.getItem('token');
    if(storedToken) this.token = storedToken;
  }

  getToken() { return this.token; }

  userLoggedIn() { return this.token !== ''; }

  signup(data: any) {
    return this.http.post(`${this.baseApiUrl}/users`, data, {
      headers: new HttpHeaders({
        'Cache-Control': 'no-cache',
        'Content-Type':  'application/json'
      })
    });
  }

  login(data: any) {
    return this.http.post(`${this.baseApiUrl}/login`, data, {
      headers: new HttpHeaders({
        'Cache-Control': 'no-cache',
        'Content-Type':  'application/json'
      })
    })
    .pipe(
      tap(
        (response: any) => {
          if(response.message === 'Utente Loggato'){
            this.token = response.token;
            localStorage.setItem('token', this.token);
          }
        }
      )
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.token = '';
  }

  getSavedLocations() {
    return this.http.get<any[]>(`${this.baseApiUrl}/saved-locations`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        'Cache-Control': 'no-cache'
      })
    });
  }

  getUserInfo() {
    return this.http.get<any>(`${this.baseApiUrl}/users`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        'Cache-Control': 'no-cache'
      })
    });
  }

  postSavedLocation(data: any) {
    return this.http.post(`${this.baseApiUrl}/saved-locations`, data, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        'Cache-Control': 'no-cache',
        'Content-Type':  'application/json'
      })
    });
  }

  deleteSavedLocation(i: number) {
    return this.http.delete(`${this.baseApiUrl}/saved-locations`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        'Cache-Control': 'no-cache'
      }),
      params: { i: i }
    });
  }

  postAlert(data: any) {
    return this.http.post(`${this.baseApiUrl}/alerts`, data, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        'Cache-Control': 'no-cache',
        'Content-Type':  'application/json'
      })
    });
  }

  updateUserData(data: any) {
    return this.http.put(`${this.baseApiUrl}/users`, data, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        'Cache-Control': 'no-cache',
        'Content-Type':  'application/json'
      })
    });
  }

  deleteAccount() {
    return this.http.delete(`${this.baseApiUrl}/users`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        'Cache-Control': 'no-cache'
      })
    });
  }
}
