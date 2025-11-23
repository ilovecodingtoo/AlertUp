import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatusService {
  message: string = '';
  success: boolean = false;

  setMessage(message: string, success: boolean) {
    this.success = success;
    this.message = message;
    setTimeout(() => { this.message = ''; }, 3000);
  }
}