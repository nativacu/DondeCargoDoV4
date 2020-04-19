import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPage } from './pages/login/login';
import { MapPage } from './pages/map/map';
import { ReceiptPage } from './pages/receipt/receipt';
import { RegisterPage } from './pages/register/register';
import { RegisterPlugPage } from './pages/register-plug/register-plug';
import { ChargeConfirmationPage } from './pages/charge-confirmation/charge-confirmation';
import { ChargingMenuPage } from './pages/charging-menu/charging-menu';
import { TransactionListPage } from './pages/transaction-list/transaction-list';
import { ReservationPage } from './pages/reservation/reservation';
import { AddPlugPage } from './pages/add-plug/add-plug';

const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginPage},
    { path: 'map', component: MapPage},
    { path: 'receipt', component: ReceiptPage},
    { path: 'register', component: RegisterPage},
    { path: 'register-plug', component: RegisterPlugPage},
    { path: 'charging-menu', component: ChargingMenuPage},
    { path: 'charge-confirmation', component: ChargeConfirmationPage},
    { path: 'transaction-list', component: TransactionListPage},
    { path: 'reservation', component: ReservationPage},
    { path: 'add-plug/:id', component: AddPlugPage}
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
