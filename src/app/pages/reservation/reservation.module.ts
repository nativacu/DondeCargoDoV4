import { NgModule } from '@angular/core';
import {IonicModule} from '@ionic/angular';
import { ReservationPage } from './reservation';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    ReservationPage,
  ],
    imports: [
        IonicModule,
        FormsModule,
    ],
})
export class ReservationPageModule {}
