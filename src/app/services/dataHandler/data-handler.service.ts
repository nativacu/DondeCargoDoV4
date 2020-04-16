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

@Injectable({
  providedIn: 'root'
})
export class DataHandlerService {
  cargador: Cargador;
  cobro: Cobro;
  cuentaBancaria: CuentaBancaria;
  iotPlug: IOTPlug;
  lugar: Lugar;
  pago: Pago;
  tarjetaCredito: TarjetaCredito;
  transaccionCarga: TransaccionCarga;
  user: User;
  vehiculo: Vehiculo;
  
  constructor() { }
}
