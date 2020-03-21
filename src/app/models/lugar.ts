export class Lugar {
    UserUserID: number;
    LugarID: number;
    Nombre: string;
    Direccion: string;
    Hora_Inicio_Operaciones: string; // TODO check type db has time
    Hora_Fin_Operaciones: string; // TODO check type db has time
    Dia_Inicio_Operaciones: string;
    Dia_Fin_Operaciones: string;
    Latitud: number;
    Longitud: number;
    TipoCostoCarga: string;
    CostoCarga: number;
    Descripcion: string;
}
