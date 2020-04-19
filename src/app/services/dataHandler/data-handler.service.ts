import { Injectable } from '@angular/core';
import { Cargador } from 'src/app/models/cargador';
import { CuentaBancaria } from 'src/app/models/cuenta-bancaria';
import { Cobro } from 'src/app/models/cobro';
import { IOTPlug } from 'src/app/models/iotplug';
import { Lugar } from 'src/app/models/lugar';
import { Pago } from 'src/app/models/pago';
import { TarjetaCredito } from 'src/app/models/tarjeta-credito';
import { TransaccionCarga } from 'src/app/models/transaccion-carga';
import { User } from 'src/app/models/user';
import { Vehiculo } from 'src/app/models/vehiculo';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataHandlerService {
  private user = new BehaviorSubject<User>(null);
  currentUser = this.user.asObservable().toPromise();

  private place = new BehaviorSubject<Lugar>(null);
  currentPlace = this.place.asObservable().toPromise();

  private charger = new BehaviorSubject<Cargador>(null);
  currentCharger = this.charger.asObservable().toPromise();

  private IOTPlug = new BehaviorSubject<IOTPlug>(null);
  currentIOTPlug = this.IOTPlug.asObservable().toPromise();

  // Not Implemented yet
  private currentBill = new BehaviorSubject<Cobro>(null);
  private currentBankAccount = new BehaviorSubject<CuentaBancaria>(null);
  private currentPayment = new BehaviorSubject<Pago>(null);
  private currentCreditCard = new BehaviorSubject<TarjetaCredito>(null);
  private currentTransaction = new BehaviorSubject<TransaccionCarga>(null);
  private currentCar = new BehaviorSubject<Vehiculo>(null);

  constructor() { }

  setCurrentUser(user: User) {
    this.user.next(user);
  }

  setCurrentPlace(place: Lugar) {
    this.place.next(place);
  }

  setCurrentCharger(charger: Cargador) {
    this.charger.next(charger);
  }
}
