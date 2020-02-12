import {Component, ElementRef, ViewChild} from '@angular/core';
import {MenuController, NavController, Platform} from '@ionic/angular';
import {LocationsProvider} from '../../services/locations/locations';
import {GoogleMapsProvider} from '../../services/google-maps/google-maps';
import {HttpRequestProvider} from '../../services/http-request/http-request';
import {AuthProvider} from '../../services/auth/auth';
import {WebsocketProvider} from '../../services/websocket/websocket';

@Component({
    selector: 'page-map',
    templateUrl: 'map.html'
})

export class MapPage {


    @ViewChild('map', {static: false}) mapElement: ElementRef;
    @ViewChild('pleaseConnect', {static: false}) pleaseConnect: ElementRef;

    data: any;
    currentCharger: any;
    showButton: boolean;
    adminButton: boolean;
    userId: any;
    // tipos de cargadores
    constructor(public navCtrl: NavController,
                public maps: GoogleMapsProvider,
                public http: HttpRequestProvider,
                public platform: Platform,
                public locations: LocationsProvider,
                public menu: MenuController,
                public fauth: AuthProvider,
                public socket: WebsocketProvider) {
        this.fauth.currUser.subscribe((usr) => {
            if (usr) {
                this.userId = usr.UserID;
            }
        });
        this.socket.getMessages().subscribe((data: any) => {
            switch (data.Command) {
                case 'LugaresRetreived':
                    this.chargersInit(data.Lugares);
                    break;
                case 'ChargeInitRequest':
                    // TODO send data: this.navCtrl.navigateForward('charge-confirmation', {data});
                    this.navCtrl.navigateForward('charge-confirmation');
                    break;
                case 'ChargeInitSecured':
                    // carga iniciada
                    // TODO send data: this.navCtrl.navigateForward('charging-menu', {Date: this.chargeInitSecuredLogic(data)});
                    this.navCtrl.navigateForward('charging-menu');
                    break;
                case 'ChargeEndSecured':
                    // fin de la carga
                    console.log(data.Monto);
                    this.navCtrl.pop();
                    break;
                case 'TransactionRequest':
                    // TODO send data this.navCtrl.navigateForward('transaction-list', {data: this.transactionRequestLogic(data)});
                    this.navCtrl.navigateForward('transaction-list');
                    break;
                default:
                    break;
            }
        });
        this.socket.sendMessage(JSON.stringify({Command: 'GetLugares'}));
        this.adminButton = false;

    }


    ionViewDidLoad() {


        this.platform.ready().then(() => {
            // TODO change all this logic of stationrequest
        });

    }

    toReserve() {
        /* TODO send data this.navCtrl.navigateForward('reservation', {
            charger: this.currentCharger
        });*/
        this.navCtrl.navigateForward('reservation');
    }
    addPlug() {
        this.navCtrl.navigateForward('add-plug/' + this.currentCharger.LugarID);
    }
    configurePlug() {

    }
    chargersInit(data) {
        this.data = data;
        this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement, this.navCtrl, this.data);

        // Waiting for charger to be pressed to transition to reserve charging station screen
        const chargerObserver = this.maps.chargerObserver;

        chargerObserver.subscribe(currentCharger => {
            if (currentCharger != null) {
                this.currentCharger = currentCharger;
                this.adminButton = (this.userId === currentCharger.UserUserID);
                // Reducing map to show button
                const map = document.getElementById('map');
                const button = document.getElementById('reserveButton');
                const buttonadd = document.getElementById('addPlugButton');
                const buttonconf = document.getElementById('ConfigurePlugButton');
                map.style.height = (!this.adminButton ? '93%' : '77%');
                button.hidden = false;
                button.style.color = 'white';
                console.log(currentCharger.type);
                if (this.adminButton) {
                    buttonadd.hidden = false;
                    buttonconf.hidden = false;
                } else {
                    buttonadd.hidden = true;
                    buttonconf.hidden = true;
                }
                if (!currentCharger.is_operational || currentCharger.type === 'No afiliado') {
                    button.setAttribute('disabled', 'disabled');
                } else {
                    if (button.hasAttribute('disabled')) {
                        button.removeAttribute('disabled');
                    }
                }
            }
        });

    }

    private chargeInitSecuredLogic(data: any) {
        const dateInit: string = data.Fecha_Inicio;
        const datePar = dateInit.split('-');
        const hourInit: string = data.Hora_Inicio;
        const hourPar = hourInit.split(':');
        return new Date(+datePar[0], +datePar[1] - 1, +datePar[2], +hourPar[0], +hourPar[1]);
    }

    private transactionRequestLogic(data: any) {
        for (const ok of data.Transactions) {
            if (ok.Monto) {
                const dateInit: Array<string> = ok.Fecha_Inicio.split('-');
                const hourInit: Array<string> = ok.Hora_Inicio.split(':');
                const initDate: any = new Date(+dateInit[0], +dateInit[1] - 1, +dateInit[2], +hourInit[0], +hourInit[1]);
                const dateEnd: Array<string> = ok.Fecha_Fin.split('-');
                const hourEnd: Array<string> = ok.Hora_Fin.split(':');
                const endDate: any = new Date(+dateEnd[0], +dateEnd[1] - 1, +dateEnd[2], +hourEnd[0], +hourEnd[1]);
                ok.Date = new Date(endDate - initDate);
            } else {
                ok.Date = new Date();
            }
        }
        return data;
    }

}
