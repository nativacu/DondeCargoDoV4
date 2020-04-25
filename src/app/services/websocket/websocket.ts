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

    private static socket: WebSocket;
    observable: Observable<any>;
    constructor(public http: HttpClient, public afs: AuthProvider) {
    }

    startConnection() {
        return new Promise<string>( (resolve, reject) => {
            if (WebsocketProvider.socket && WebsocketProvider.socket.readyState === WebSocket.OPEN) {
                resolve();
            } else {
                WebsocketProvider.socket = new WebSocket(serverAddress);
                this.observable = new Observable(observer => {
                    WebsocketProvider.socket.onmessage = (data) => {
                        observer.next(JSON.parse(data.data));
                    };
                });
                WebsocketProvider.socket.onopen = ((event) => {
                    resolve();
                });
                WebsocketProvider.socket.onerror = ((event) => {
                    reject('No se pudo establecer la comunicación con el servidor');
                });
            }

        });
    }

    sendMessage(data) {
        WebsocketProvider.socket.send(data);
    }

    getMessages() {
        return this.observable ? this.observable : new Observable<any>();
    }
    disconnect() {
        WebsocketProvider.socket.close();
    }

}
