import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AddPlugPage } from './add-plug';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AddPlugPage,
  ],
  imports: [
    // IonicPageModule.forChild(AddPlugPage),
    IonicModule,
    ReactiveFormsModule
  ],
})
export class AddPlugPageModule {}
