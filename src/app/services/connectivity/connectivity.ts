import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { Platform } from '@ionic/angular';

declare var Connection;

@Injectable({ providedIn: 'root' })
export class ConnectivityProvider {

  onDevice: boolean;

  constructor(public platform: Platform, private network: Network){
    this.onDevice = this.platform.is('mobile');
  }

  isOnline(): boolean {
    if(this.onDevice && this.network.Connection){
      return this.network.Connection !== Connection.NONE;
    } else {
      return navigator.onLine; 
    }
  }

  isOffline(): boolean {
    if(this.onDevice && this.network.Connection){
      return this.network.Connection === Connection.NONE;
    } else {
      return !navigator.onLine;   
    }
  }

}