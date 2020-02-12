import { NgModule } from '@angular/core';
import {IonicModule} from '@ionic/angular';
import { LoginPage } from './login';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [
    LoginPage,
  ],
    imports: [
        IonicModule,
        FormsModule,
        IonicModule,
        CommonModule,
    ],
})
export class LoginPageModule {}
