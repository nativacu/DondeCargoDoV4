import { Component } from '@angular/core';
import { NavController, NavParams, IonicModule } from '@ionic/angular';
import { WebsocketProvider } from '../../services/websocket/websocket';
import { AuthProvider } from '../../services/auth/auth';
import {NgModule} from '@angular/core';
import {RoundProgressModule} from 'angular-svg-round-progressbar';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReceiptPage } from '../receipt/receipt';
import { AlertController } from '@ionic/angular';
/**
 * Generated class for the ChargingMenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-charging-menu',
    templateUrl: 'charging-menu.html',
})
@NgModule({
    imports: [RoundProgressModule]
})
export class ChargingMenuPage {

    time: string;
    timeElapsed: Date;
    startTime: any;
    user: any;
    current = 1;
    max = 100;
    duration = 20; // 0 si el usuario no puso maximo
    background = '#eaeaea'; // #eaeaea si el usuario puso maximo

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private socket: WebsocketProvider,
                private afauth: AuthProvider,
                private alertCtrl: AlertController) {
        this.startTime = (navParams.get('Date')) ? navParams.get('Date') : new Date();
        // this.startTime = new Date();
        console.log(Date());
        setInterval(this.counter.bind(this), 1000);

        setInterval(this.progress.bind(this), 50);

        afauth.getUser().subscribe((usr) => {
            this.user = usr.email;
        });
        this.socket.getMessages().subscribe((data) => {
            switch (data.Command) {
                case 'ChargeEndSecured':
                    const dateEnd: string = data.Fecha_Fin;
                    const datePar = dateEnd.split('-');
                    const hourEnd: string = data.Hora_Fin;
                    const hourPar = hourEnd.split(':');
                    // TODO: Mandar data!!
                    // this.navCtrl.navigateRoot('receipt', {monto: data.Monto, startTime: this.startTime, endTime: new Date(+datePar[0], +datePar[1] - 1, +datePar[2], +hourPar[0], +hourPar[1])});
                    break;
            }
        });
    }

    counter() {
        const currentTime: any = new Date();
        this.timeElapsed = new Date(currentTime - this.startTime);
        const elapseHour: number = Math.floor(this.timeElapsed.getTime() / 3600000);
        const elapseMinute: number = Math.floor((this.timeElapsed.getTime() / 60000) % 60);
        const elapseSecond: number = Math.floor((this.timeElapsed.getTime() / 1000) % 60);
        this.time = (elapseHour < 10 ? '0' : '') + elapseHour + ':' +
            (elapseMinute < 10 ? '0' : '') + elapseMinute + ':' +
            (elapseSecond < 10 ? '0' : '') + elapseSecond;
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ChargingMenuPage');
    }

    getOverlayStyle() {
        const isSemi = true;
        const transform = (isSemi ? '' : 'translateY(-50%) ') + 'translateX(-50%)';

        return {
            top: isSemi ? '44%' : '50%',
            bottom: isSemi ? '10%' : 'auto',
            left: '50%',
            transform,
            '-moz-transform': transform,
            '-webkit-transform': transform,
            'font-size': 125 / 3.5 + 'px'
        };
    }


    async presentConfirm() {
        const alert = await this.alertCtrl.create({
            header: 'Detener',
            message: '¿Desea detener la carga?',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Sí',
                    handler: () => {
                        console.log(JSON.stringify({Command: 'ChargingCancellation', Email: this.user}));
                        this.socket.sendMessage(JSON.stringify({Command: 'ChargingCancellation', email: this.user}));
                    }
                }
            ]
        });
        await alert.present();
    }

    progress() {

        this.current += 0.1;

        if (this.current >= this.max) {
            this.current = 1;
        }

    }


}
