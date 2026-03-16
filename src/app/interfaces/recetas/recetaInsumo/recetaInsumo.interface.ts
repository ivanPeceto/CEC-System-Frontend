import { Insumo } from "../../insumos/insumo.interface";

export interface RecetaInsumo {
    id: string;
    cantidad: string;
    insumo: Insumo;
    deletedAt: string | null;
}