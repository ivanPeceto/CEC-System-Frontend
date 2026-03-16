export interface Insumo {
    id: string;
    nombre: string;
    descripcion?: string;
    unidad_medida: string;
    costo_unidad_medida: string;
    deletedAt: string | null;
}