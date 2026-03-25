import { CreateRecetaInsumoDto } from "../recetaInsumo/dto/createRecetaInsumo.dto";
import { CreateRecetaSubrecetaDto } from "../recetaSubreceta/dto/createRecetaSubreceta.dto";

export interface CreateRecetaDto {
  nombre: string;
  descripcion?: string;
  unidad_medida: string;
  unidades_por_receta: string;
  insumos: CreateRecetaInsumoDto[];
  subrecetas: CreateRecetaSubrecetaDto[];
}