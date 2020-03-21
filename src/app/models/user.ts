export class User {
    UserID: number;
    Cedula: string;
    PrimerNombre: string;
    SegundoNombre: string;
    PrimerApellido: string;
    SegundoApellido: string;
    TipoUsuario: number;
    Foto: Blob; //TODO check if type needs to be string
    Email: string;
    Telefono: string;
}
