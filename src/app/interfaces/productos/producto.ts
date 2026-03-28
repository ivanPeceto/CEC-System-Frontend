import { Categoria } from "../categorias/categoria";
import { Receta } from "../recetas/recetas.interface";
import { ReglasPrecio } from "../reglas-precio/reglas-precio";

export interface Producto {
  id: string;
  nombre: string;
  nombre_impresion: string;
  descripcion?: string;
  precio_unitario: string;
  categoria: Categoria;
  receta?: Receta;
  cantidad_receta: string;
  precio_estimado: string;
  margen_beneficio: string;
  reglas_precio: ReglasPrecio[];
  deletedAt: Date;
}
