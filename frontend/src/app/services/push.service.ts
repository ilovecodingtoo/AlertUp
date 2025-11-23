import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PushService {
  pushNotificationsAllowed = false;

  constructor() {}

  loadLPushNotificationsPermission() {
    const storedPushNotificationsAllowed = localStorage.getItem('pushNotificationsAllowed');
    if(!storedPushNotificationsAllowed) localStorage.setItem('pushNotificationsAllowed', JSON.stringify(false));
    else this.pushNotificationsAllowed = JSON.parse(storedPushNotificationsAllowed);
  }

  togglepushNotifications() {
    if(this.pushNotificationsAllowed){
      this.pushNotificationsAllowed = false;
      localStorage.setItem('pushNotificationsAllowed', JSON.stringify(false));
    }
    else{
      this.pushNotificationsAllowed = true;
      localStorage.setItem('pushNotificationsAllowed', JSON.stringify(true));
    }
  }
}
