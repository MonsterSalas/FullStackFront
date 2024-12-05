export interface Rol {
    id?: number;
    nombre: string;
}

export interface ResponseDTO {
    mensaje: string;
    data: any;
    exitoso: boolean;
}