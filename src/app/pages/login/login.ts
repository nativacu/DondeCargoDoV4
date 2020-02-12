import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { AuthProvider } from '../../services/auth/auth';
import { HttpRequestProvider } from '../../services/http-request/http-request';
import { PlatformProvider } from '../../services/platform/platform';
import { WebsocketProvider } from '../../services/websocket/websocket';
import { OneSignal } from '@ionic-native/onesignal';


/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'login',
  templateUrl: 'login.html',
  providers: [PlatformProvider, HttpRequestProvider, WebsocketProvider]
})
export class LoginPage implements OnInit {

  loginEmail: string;
  loginPassword: string;
  loginIp: string;
  id: string;
  phone: string;
  inputType = 'password';
  loading: any;
  constructor(
      public platform: PlatformProvider,
      public navCtrl: NavController,
      public fauth: AuthProvider,
      public http: HttpRequestProvider,
      public socket: WebsocketProvider,
      public loadingCtrl: LoadingController) {
  }
  ngOnInit(): void {
    // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    // Add 'implements OnInit' to the class.

    // this.getSocketMessages();
  }
  ionViewDidLoad() {

    console.log('ionViewDidLoad LoginPage');
  }
  async login() {
    this.loading = await this.loadingCtrl.create({
      spinner: 'circles',
      message: 'Connecting',
    });
    await this.loading.present();

    // TODO socket startConnection
    this.socket.startConnection(this.loginIp).then(() => {
      this.getSocketMessages();
      this.fauth.doLogin({email: this.loginEmail, password: this.loginPassword}).then(
          () => {
            if (this.platform.checkPlatform()) {
              this.loading.setDuration(5000);
              new Promise<any>((resolve, reject) => {
                this.loading.onDidDismiss(() => {
                  reject('El servicio de notificaciones no esta disponible');
                });

                OneSignal.getIds().then((idData) => {
                  resolve(idData);
                });
              }).then((idData) => {
                this.socket.sendMessage(JSON.stringify({
                  Command: 'CrearConexion',
                  Email: this.loginEmail,
                  OneSignalId: idData.userId
                }));
              }, (error) => {
                window.alert(error);
              });
            } else {
              this.socket.sendMessage(JSON.stringify({
                Command: 'CrearConexion',
                Email: this.loginEmail,
                OneSignalId: 0
              }));
            }
          },
          (error) => {
            window.alert(error);
            this.loading.dismiss();
          }
      );
    }, (error) => {
      window.alert(error);
      this.loading.dismiss();
    });
  }

  openRegister() {
    this.navCtrl.navigateForward('register');
    // const registerModal = this.modal.create('RegisterPage');
    // registerModal.present();
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data

  }

  test() {
    // TODO options
    // this.navCtrl.navigateForward('charging-menu', {Date: new Date(2019, 11, 13, 0, 38, 6)});
  }

  showHide() {
    this.inputType = this.inputType === 'text' ? 'password' : 'text';
  }

  getSocketMessages() {
    this.socket.getMessages().subscribe((data: any) => {
      console.log(data);
      this.loading.dismiss();
      switch (data.Command) {
        case 'ConexionCreated':
            this.fauth.currUser.next(data);
            this.navCtrl.navigateRoot('map');
            break;
        default:
          break;
      }
    });
  }

}
