import { HttpClient } from '@angular/common/http';
import { Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthProvider } from '../auth/auth';
/*
  Generated class for the WebsocketProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class WebsocketProvider {

  socket: WebSocket;
  observable: Observable<any>;
  constructor(public http: HttpClient, public afs: AuthProvider) {
    console.log('Hello WebsocketProvider Provider');
    // this.startConnection("10.60.16.74");
  }

  startConnection(ipAddress: string) {
    return new Promise<any>( (resolve, reject) => {
      ipAddress = ipAddress ? ipAddress : '190.113.73.11';
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        resolve();
      }
      this.socket = new WebSocket('ws://' + ipAddress + ':443/');
      // this.socket = new WebSocket('ws://190.113.73.11:443');

      this.observable = new Observable(observer => {
        this.socket.onmessage = (data) => {
          console.log(data);
          observer.next(JSON.parse(data.data));
        };
      });
      this.socket.onopen = ((event) => {
        resolve();
      });
      this.socket.onerror = ((event) => {
        reject('Connection Failed ');
      });
    });
  }
  sendMessage(data) {
    this.socket.send(data);
  }

  public getMessages() {
    return this.observable;
  }
  disconnect() {
    this.socket.close();
  }

}
