export interface Producto {
    id?: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    categoria: string;
}
export interface CarritoItem {
    producto: Producto;
    cantidad: number;
}

export interface ProductoDTO {
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    categoria: string;
}