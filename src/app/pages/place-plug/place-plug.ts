import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { GoogleMapsProvider } from '../../services/google-maps/google-maps';
import { RegisterPlugPage } from '../register-plug/register-plug';

/**
 * Generated class for the PlacePlugPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
    selector: 'page-place-plug',
    templateUrl: 'place-plug.html',
})

export class PlacePlugPage {

    @ViewChild('map', {static: false}) mapElement: ElementRef;
    @ViewChild('pleaseConnect', {static: false}) pleaseConnect: ElementRef;
    user: any;
    constructor(public navCtrl: NavController, public navParams: NavParams, public maps: GoogleMapsProvider) {
        this.user = this.navParams.get('email');
    }

    ionViewDidLoad() {
        this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement, this.navCtrl, []);
    }

    toRegisterPlug() {
        const center = this.maps.map.center;
        // this.maps.addMarker(center);
        // TODO send data this.navCtrl.navigateForward('register-plug', {location: center, email: this.user});
        this.navCtrl.navigateForward('register-plug');
    }
}
