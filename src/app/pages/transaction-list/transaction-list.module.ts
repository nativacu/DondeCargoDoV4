import { NgModule } from '@angular/core';
import {IonicModule} from '@ionic/angular';
import { TransactionListPage } from './transaction-list';

@NgModule({
  declarations: [
    TransactionListPage,
  ],
    imports: [
        IonicModule,
    ],
})
export class TransactionListPageModule {}
