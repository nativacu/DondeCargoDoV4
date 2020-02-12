import { NgModule } from '@angular/core';
import { ChargeConfirmationPage } from './charge-confirmation';
import {IonicModule} from '@ionic/angular';

@NgModule({
  declarations: [
    ChargeConfirmationPage,
  ],
    imports: [
        // IonicPageModule.forChild(ChargeConfirmationPage),
        IonicModule
    ],
})
export class ChargeConfirmationPageModule {}
