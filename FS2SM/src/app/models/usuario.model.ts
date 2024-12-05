export interface Usuario {
  id?: number;
  nombreCompleto: string;
  username: string;
  password: string;
  rol: {
    id: number;
  };
  }
  
  export interface ResponseDTO {
    mensaje: string;
    data: any;
    exitoso: boolean;
  }