import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { AuthProvider } from '../../services/auth/auth';
import { HttpRequestProvider } from '../../services/http-request/http-request';
import { PlatformProvider } from '../../services/platform/platform';
import { WebsocketProvider } from '../../services/websocket/websocket';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { FirebaseUser, LoginCommand, User } from '../../models/user';
import { LogicalFileSystem } from '@angular/compiler-cli/src/ngtsc/file_system';


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
      public loadingCtrl: LoadingController,
      private oneSignal: OneSignal) {
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
      message: 'Conectando',
    });
    await this.loading.present();

    const startedConnection = await this.startSocketConnection();

    if (startedConnection) {
      await this.connectToFirebase();
    }
    // TODO socket startConnection

    await this.socket.startConnection().then(() => {
      const user = new FirebaseUser(this.loginEmail, this.loginPassword);
      this.fauth.doLogin(user).then(
          () => {
            if (this.platform.checkIsMobile()) {

              setTimeout(() => {
                this.loading.dismiss();
              }, 5000);

              new Promise<any>(async (resolve, reject) => {
                 await this.loading.onDidDismiss(() => {
                  reject('El servicio de notificaciones no esta disponible');
                });

                 this.oneSignal.getIds().then((idData) => {
                  resolve(idData);
                });
              }).then((idData) => {
                const command = new LoginCommand(this.loginEmail, idData.userId);
                this.socket.sendMessage(command);
              }, (error) => {
                window.alert(error);
              });
            } else {
              const command = new LoginCommand(this.loginEmail, 0);
              this.socket.sendMessage(command);
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

  async startSocketConnection(): Promise<boolean> {
    try {
      await this.socket.startConnection();
      this.getSocketMessages();
      return true;
    } catch (error) {
      window.alert(error);
      this.loading.dismiss();
      return false;
    }
  }

  async connectToFirebase() {
    try {
      const user = new FirebaseUser(this.loginEmail, this.loginPassword);
      await this.fauth.doLogin(user);
      if (this.platform.checkIsMobile()) {
        setTimeout(() => {
          this.loading.dismiss();
        }, 5000);

        new Promise<any>(async (resolve, reject) => {
          await this.loading.onDidDismiss(() => {
            reject('El servicio de notificaciones no esta disponible');
          });

          await this.oneSignal.getIds().then((idData) => {
            resolve(idData);
          });
        }).then((idData) => {
          const command = new LoginCommand(this.loginEmail, idData.userId);
          this.socket.sendMessage(command);
        }, (error) => {
          window.alert(error);
        });
      }

    } catch (error) {
      console.log(error);
    }
  }

  openRegister() {
    this.navCtrl.navigateForward('register');
    // const registerModal = this.modal.create('RegisterPage');
    // registerModal.present();
  }

  showHide() {
    this.inputType = this.inputType === 'text' ? 'password' : 'text';
  }

  getSocketMessages() {
    this.socket.getMessages().subscribe((data: LoginCommand) => {
      this.loading.dismiss();
      switch (data.Command) {
        case 'ConexionCreated':
            this.fauth.currUser.next(data.User);
            this.navCtrl.navigateRoot('map');
            break;
        default:
          break;
      }
    });
  }

}
