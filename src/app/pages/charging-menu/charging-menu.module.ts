import { NgModule } from '@angular/core';
import {IonicModule} from '@ionic/angular';
import { ChargingMenuPage } from './charging-menu';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [
    ChargingMenuPage,
  ],
  imports: [
    // IonicPageModule.forChild(ChargingMenuPage),
    IonicModule,
    CommonModule,
    IonicModule,
  ],
})
export class ChargingMenuPageModule {}
