import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocationService } from './location.service';
import { environment } from './../environments/environment';
import { tap } from 'rxjs/operators';
import { PushNotifications, Token } from '@capacitor/push-notifications';
import { StatusService } from './status.service';
import { Router } from '@angular/router';
import { LocalNotifications } from '@capacitor/local-notifications';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  pushNotificationsAllowed = false;
  private token = '';
  private baseApiUrl = environment.BASE_API_URL;
  
  constructor(private http: HttpClient, private location: LocationService, public status: StatusService, private router: Router) {}

  loadPushNotificationsPermission() {
    const storedPushNotificationsAllowed = localStorage.getItem('pushNotificationsAllowed');
    if(!storedPushNotificationsAllowed) localStorage.setItem('pushNotificationsAllowed', JSON.stringify(false));
    else this.pushNotificationsAllowed = JSON.parse(storedPushNotificationsAllowed);
  }

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
          this.pushNotificationsAllowed = false;
          localStorage.setItem('pushNotificationsAllowed', JSON.stringify(false));
          if(response.message === 'Utente Loggato'){
            this.token = response.token;
            localStorage.setItem('token', this.token);
          }
        }
      )
    );
  }

  logout() {
    this.unsubscribePush().subscribe({
      next: () => {
        this.pushNotificationsAllowed = false;
        localStorage.setItem('pushNotificationsAllowed', JSON.stringify(false));
        localStorage.removeItem('token');
        this.token = '';
        return false;
      },
      error: () => {
        this.status.setMessage('Errore di connessione', false);
        return true;
      }
    });
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

  subscribePush(pushToken: any) {
    return this.http.post(`${this.baseApiUrl}/push`, { pushToken: pushToken }, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        'Cache-Control': 'no-cache',
        'Content-Type':  'application/json'
      })
    });
  }

  unsubscribePush() {
    return this.http.delete(`${this.baseApiUrl}/push`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        'Cache-Control': 'no-cache'
      })
    });
  }

  async togglepushNotifications(): Promise<any> {
    if(this.pushNotificationsAllowed){
      this.unsubscribePush().subscribe({
        next: () => {
          this.pushNotificationsAllowed = false;
          localStorage.setItem('pushNotificationsAllowed', JSON.stringify(false));
          return false;
        },
        error: () => {
          this.status.setMessage('Errore di connessione', false);
          return true;
        }
      });
    }
    else{
      const permissions = await PushNotifications.requestPermissions();
      if(permissions.receive !== 'granted') return false;
      PushNotifications.addListener('registration', (pushToken: Token) => {
        console.log(pushToken);
        this.subscribePush(pushToken).subscribe({
          next: () => {
            this.pushNotificationsAllowed = true;
            localStorage.setItem('pushNotificationsAllowed', JSON.stringify(true));
            return true;
          },
          error: () => {
            this.status.setMessage('Errore di connessione', false);
            return false;
          }
        });
      });
      PushNotifications.addListener('registrationError', (error) => {
        console.log(error);
        this.status.setMessage('Notifiche non disponibili', false);
        return false;
      });
      PushNotifications.addListener('pushNotificationReceived', async (notification) => {
        console.log('Notification received: ', notification);
        await LocalNotifications.schedule({
          notifications: [
            {
              title: notification.title ?? '',
              body: notification.body ?? '',
              id: new Date().getTime()
            }
          ]
        });
      });
      PushNotifications.addListener('pushNotificationActionPerformed', () => {
        this.router.navigate(['/']);
      });
      await PushNotifications.register();
    }
  }
}
