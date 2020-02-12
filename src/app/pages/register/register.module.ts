import { NgModule } from '@angular/core';
import {IonicModule} from '@ionic/angular';
import { RegisterPage } from './register';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    RegisterPage,
  ],
    imports: [
        IonicModule,
        ReactiveFormsModule,
    ],
})
export class RegisterPageModule {}
