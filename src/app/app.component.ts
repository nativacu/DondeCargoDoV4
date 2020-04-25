
import { Component } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LoginPage } from './pages/login/login';
import { AuthProvider } from './services/auth/auth';
import { HttpRequestProvider } from './services/http-request/http-request';
import { WebsocketProvider } from './services/websocket/websocket';
import { OneSignal } from '@ionic-native/onesignal';
import { oneSignalAppId, senderId } from '../environments/environment';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { OSNotificationPayload } from '@ionic-native/onesignal';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})

export class AppComponent {
    user: any;
    rootPage: any = LoginPage;
    userName: string;
    imageSrc: string;
    email: string;
    lname: string;
    accountType: number;
    loggedIn = false;
    editing = false;

    phoneNumber: string;
    constructor(private platform: Platform,
                private statusBar: StatusBar,
                private splashScreen: SplashScreen,
                public fauth: AuthProvider,
                public http: HttpRequestProvider,
                public socket: WebsocketProvider,
                private alertCtrl: AlertController) {

        //  this.push.hasPermission()
        // .then((res: any) => {

        //   if (res.isEnabled) {
        //     console.log('We have permission to send push notifications');
        //   } else {
        //     console.log('We do not have permission to send push notifications');
        //   }

        // });
        this.initializeApp();
        this.fauth.currUser.subscribe((usr) => {
            this.user = usr;
            if (this.user) {
                this.loggedIn = true;
                this.imageSrc = this.user.Foto;
                this.accountType = +this.user.TipoUsuario;
                if (this.imageSrc == null || this.imageSrc === 'NULL') {
                    this.imageSrc = 'https://www.stickpng.com/assets/images/585e4bf3cb11b227491c339a.png';
                }
                this.userName = this.user.PrimerNombre;
                this.lname = this.user.PrimerApellido;
                this.phoneNumber = this.user.Telefono;
            }
        });

        fauth.getUser().subscribe(user => {
            // this.email = user.email;
        });

        platform.ready().then(() => {
            // emailObserveray, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();

            if (this.platform.is('cordova')) {
                OneSignal.startInit(oneSignalAppId, senderId);
                OneSignal.inFocusDisplaying(OneSignal.OSInFocusDisplayOption.Notification);
                OneSignal.handleNotificationReceived().subscribe(data => this.onPushReceived(data.payload));
                OneSignal.handleNotificationOpened().subscribe(data => this.onPushOpened(data.notification.payload));
                OneSignal.endInit();
            }

        });
    }


    async initializeApp() {
        await this.platform.ready().then(() => {
                this.statusBar.styleDefault();
                this.splashScreen.hide();
            }
        );

    }
    takePicture() {
        console.log('still working');
    }

    eraseAccount() {
        // TODO change http for socket send
        this.http.sendPostRequest({email: this.email}, 'delete.php');
    }

    openGallery(): void {
        const options: CameraOptions = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            encodingType: Camera.EncodingType.JPEG,
            mediaType: Camera.MediaType.PICTURE,
            correctOrientation: true,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        };

        Camera.getPicture(options).then((imageData) => {
            this.imageSrc = 'data:image/jpeg;base64,' + imageData;
        }, (err) => {
            console.log(err);
            // Handle error
        });
    }


    changePhoneNumber() {
        const currentNo = document.getElementById('phoneNumber');
        const input = document.getElementById('phoneInput');
        // currentNo.style.display = "none";
        // input.style.display="inherit";
    }

    showInfo() {
        this.editing = false;
        this.http.sendPostRequest({primernombre: this.userName, segundonombre: 0, primerapellido: 'Perez', segundoapellido: 0, t_usuario: 2,
            foto: 0, email: this.email, telefono: this.phoneNumber}, 'Update.php');
    }

    enableEdit() {
        this.editing = true;
    }

    logout() {
        this.fauth.doLogout();
        this.socket.sendMessage({Command: 'LogOut'});
        // this.nav.setRoot(LoginPage);
    }
    addNewStation() {
        // this.nav.push(PlacePlugPage, {email: this.email});
    }
    private onPushReceived(payload: OSNotificationPayload) {
        alert('Push recevied:' + payload.body);
    }

    private async onPushOpened(payload: OSNotificationPayload) {
        const alert = await this.alertCtrl.create({
            header: 'Carga Recibida',
            message: 'Se ha detectado una conexión para cargar su vehículo. ¿Desea iniciar la carga?',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    handler: () => {
                        this.socket.sendMessage({Command: 'ChargingConfirmation', Confirmation: 'N' , PlugID: + payload.additionalData});
                    }
                },
                {
                    text: 'Sí',
                    handler: () => {
                        // this.nav.push(ChargeConfirmationPage, {data: payload.additionalData});
                        this.socket.sendMessage({Command: 'ChargingConfirmation', Confirmation: 'Y' , PlugID: + payload.additionalData});
                    }
                }
            ]
        });
        await alert.present();
    }

    showAllTransactions() {
        this.socket.sendMessage({Command: 'InitTransactionRequest', Email: this.user.Email});
    }

}
