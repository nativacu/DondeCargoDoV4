import { Component } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { WebsocketProvider } from '../../services/websocket/websocket';

/**
 * Generated class for the TransactionListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-transaction-list',
  templateUrl: 'transaction-list.html',
})
export class TransactionListPage {

  transactionList: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public websocket: WebsocketProvider) {
    this.transactionList = this.navParams.get('data').Transactions;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransactionListPage');
  }

}
