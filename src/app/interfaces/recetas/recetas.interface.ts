import { RecetaInsumo } from "./recetaInsumo/recetaInsumo.interface";
import { RecetaSubreceta } from "./recetaSubreceta/recetaSubreceta.interface";

export interface Receta {
    id: string;
    nombre: string;
    descripcion?: string;
    costo_total: string;
    unidad_medida: string;
    unidades_por_receta: string;
    costo_unidad: string;
    insumos: RecetaInsumo[];
    subrecetas: RecetaSubreceta[];
    deletedAt: string | null;
}