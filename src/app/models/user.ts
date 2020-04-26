export class User {
    UserID: number;
    Cedula: string;
    PrimerNombre: string;
    SegundoNombre: string;
    PrimerApellido: string;
    SegundoApellido: string;
    TipoUsuario: number;
    Foto: Blob; // TODO check if type needs to be string
    Email: string;
    Telefono: string;
}

export class FirebaseUser {
    $key?: string;
    name?: string;
    email: string;
    type?: string;
    password?: string;

    constructor(email?: string, password?: string) {
        this.email = email;
        this.password = password;
    }
}

export class LoginCommand {
    Command: string;
    Email?: string;
    OneSignalId?: number;
    User?: User;

    constructor(email: string, oneSignalId?: number) {
        this.Command = 'CrearConexion';
        this.Email = email;
        this.OneSignalId = oneSignalId;
    }
}
