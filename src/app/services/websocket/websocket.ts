import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthProvider } from '../auth/auth';
import { serverAddress } from '../../../environments/environment';

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
    }

    startConnection() {
        return new Promise<string>( (resolve, reject) => {
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                resolve();
            } else {
                this.socket = new WebSocket(serverAddress);
                this.observable = new Observable(observer => {
                    this.socket.onmessage = (data) => {
                        observer.next(JSON.parse(data.data));
                    };
                });
                this.socket.onopen = ((event) => {
                    resolve();
                });
                this.socket.onerror = ((event) => {
                    reject('No se pudo establecer la comunicación con el servidor');
                });
            }

        });
    }

    sendMessage(data) {
        this.socket.send(data);
    }

    getMessages() {
        return this.observable ? this.observable : new Observable<any>();
    }
    disconnect() {
        this.socket.close();
    }

}
