export class TransaccionCarga {
    TransaccionID: number;
    IOTPlugPlugID: number;
    CargadorCargadorID: number;
    ConsumoKWh: number;
    Fecha_Inicio: Date;
    Hora_Inicio: string; // TODO check type db has time
    Hora_Fin: string; // TODO check type db has time
    Monto: number;
    PagoPagoID: number;
}
