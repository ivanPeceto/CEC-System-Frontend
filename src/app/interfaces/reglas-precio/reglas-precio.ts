import { Producto } from "../productos/producto";

export interface ReglasPrecio {
  id: string;
  producto: Producto;
  cantidad_producto: string;
  precio_fijo: string;
  deletedAt: Date;
}