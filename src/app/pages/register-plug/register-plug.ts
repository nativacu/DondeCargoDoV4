import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { GoogleMapsProvider } from '../../services/google-maps/google-maps';
import { HttpRequestProvider } from '../../services/http-request/http-request';
import { MapPage } from '../map/map';
import { AddPlugPage } from '../add-plug/add-plug';
import { WebsocketProvider } from '../../services/websocket/websocket';
import { AuthProvider } from '../../services/auth/auth';

/**
 * Generated class for the RegisterPlugPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-register-plug',
  templateUrl: 'register-plug.html',
})
export class RegisterPlugPage {
  @ViewChild('map', {static: false}) mapElement: ElementRef;
  @ViewChild('pleaseConnect', {static: false}) pleaseConnect: ElementRef;
  placeLocation: any;
  daysArray: Array<string> = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
  dateInit: any;
  dateEnd: any;
  stationName: any;
  stationDir: any;
  stationDesc: any;
  number: any;
  initTimeSlot: any;
  endTimeSlot: any;
  userEmail: any;
  tipo: any;
  user: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public https: HttpRequestProvider, public socket: WebsocketProvider, public auth: AuthProvider) {
    this.placeLocation = this.navParams.get('location');
    this.userEmail = this.navParams.get('email');
    this.auth.currUser.subscribe((usr) => {
      this.user = usr;
    });
    this.socket.getMessages().subscribe((data: any) => {
      switch (data.Command) {
        case 'LugarCreado':
          this.navCtrl.navigateRoot('map');
          break;
        default:
      }
    });
  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad RegisterPlugPage');
  }

  setPicker() {

  }

  uploadData() {
      const data = {Command: 'CrearLugar', UserUserId: this.user.UserID, Nombre: this.stationName, Direccion: this.stationDir, Horario_Inicio_Operaciones: this.initTimeSlot
       , Horario_Fin_Operaciones: this.endTimeSlot, Dia_Inicio_Operaciones: this.daysArray[this.dateInit]
       , Dia_Fin_Operaciones: this.daysArray[this.dateEnd], lat: this.placeLocation.lat(), lng: this.placeLocation.lng()
       , Desc: this.stationDesc, Tipo: this.tipo, Costo: this.number};
      console.log(JSON.stringify(data));
      this.socket.sendMessage(JSON.stringify(data));
  }

}
