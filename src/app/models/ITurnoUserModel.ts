export interface ITurnoUserModel {
    id:     number;
    date:   string;
    hour:   string;
    status: Status;
    user:   User;
}

export enum Status {
    Confirmado = "CONFIRMADO",
    Pendiente = "PENDIENTE",
    Cancelado = "CANCELADO",
    Atendido = "ATENDIDO",
}

export interface User {
    id:       number;
    name:     string;
    username: string;
    phone:    string;
}
