/**
 * @file src/modules/hospitales/types.ts
 * @description Tipos de dominio para el modulo de Hospitales
 *
 * Mapeamos los nombres de columnas PostgreSQL (snake_case, mayusculas)
 * a nombres de propiedades TypeScript (camelCase, estandar JS/TS).
 *
 * @principle DIP: el dominio define sus propios tipos, independiente de Supabase
 */

/** Entidad Hospital del dominio */
export interface Hospital {
  hospitalId: number;   // <- HospitalID en la BD
  nombre: string;       // <- Nombre
  direccion: string;    // <- Direccion
  nit: string;          // <- NIT (identificacion tributaria)
  telefono: string;     // <- Telefono
}

/** DTO para crear un hospital (sin campos autogenerados) */
export type CreateHospitalDTO = Omit<Hospital, "hospitalId">;

/** DTO para actualizar (todos los campos opcionales) */
export type UpdateHospitalDTO = Partial<CreateHospitalDTO>;

/** Filtros de busqueda disponibles */
export interface HospitalFilters {
  nombre?: string;
}