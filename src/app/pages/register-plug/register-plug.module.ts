import { NgModule } from '@angular/core';
import {IonicModule} from '@ionic/angular';
import { RegisterPlugPage } from './register-plug';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    RegisterPlugPage,
  ],
    imports: [
        IonicModule,
        FormsModule,
    ],
})
export class RegisterPlugPageModule {}
