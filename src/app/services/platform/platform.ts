import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

/*
  Generated class for the PlatformProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PlatformProvider {

  isMobile: boolean;

  constructor(public http: HttpClient, public plt: Platform) {
    // this.isMobile = this.checkPlatform();
    this.isMobile = false;
  }

  checkIsMobile(): boolean {
    return this.plt.is('cordova');
  }


}
