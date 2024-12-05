export interface Usuario {
    username: string;
    nombreCompleto: string;
    password: string;
    rolId: number;
  }

export interface ResponseDTO {
    mensaje: string;
    data: any;
    exitoso: boolean;
}
