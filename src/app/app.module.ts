import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginPage } from './pages/login/login';
import { AddPlugPage } from './pages/add-plug/add-plug';
import { ChargeConfirmationPage } from './pages/charge-confirmation/charge-confirmation';
import { ChargingMenuPage } from './pages/charging-menu/charging-menu';
import { MapPage } from './pages/map/map';
import { PlacePlugPage } from './pages/place-plug/place-plug';
import { ReservationPage } from './pages/reservation/reservation';
import { TransactionListPage } from './pages/transaction-list/transaction-list';
import { ReceiptPage } from './pages/receipt/receipt';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterPage } from './pages/register/register';
import { RegisterPlugPage } from './pages/register-plug/register-plug';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthProvider } from './services/auth/auth';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { ConnectivityProvider } from './services/connectivity/connectivity';
import { GoogleMapsProvider } from './services/google-maps/google-maps';
import { LocationsProvider } from './services/locations/locations';
import { HttpRequestProvider } from './services/http-request/http-request';
import { FirebaseProvider } from './services/firebase/firebase';
import { PlatformProvider } from './services/platform/platform';
import { WebsocketProvider } from './services/websocket/websocket';
import { firebase } from '../environments/environment';
import { Network } from '@ionic-native/network/ngx';

@NgModule({
  declarations: [
      AppComponent,
      LoginPage,
      AddPlugPage,
      ChargeConfirmationPage,
      ChargingMenuPage,
      MapPage,
      PlacePlugPage,
      ReservationPage,
      ReceiptPage,
      TransactionListPage,
      RegisterPage,
      RegisterPlugPage
  ],
  entryComponents: [],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        RoundProgressModule,
        HttpClientModule,
        AngularFireModule.initializeApp(firebase),
        AngularFireAuthModule
    ],
    exports: [
        AddPlugPage,
        ChargeConfirmationPage,
        ChargingMenuPage,
        LoginPage,
        MapPage,
        PlacePlugPage,
        ReceiptPage,
        RegisterPage,
        RegisterPlugPage,
        ReservationPage,
        TransactionListPage
    ],
  providers: [
    StatusBar,
    SplashScreen,
      AuthProvider,
      ConnectivityProvider,
      SplashScreen,
      StatusBar,
      GoogleMapsProvider,
      LocationsProvider,
      HttpRequestProvider,
      AngularFireDatabase,
      AuthProvider,
      FirebaseProvider,
      PlatformProvider,
      WebsocketProvider,
      Network,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
