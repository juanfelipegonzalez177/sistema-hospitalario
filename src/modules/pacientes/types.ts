/**
 * @file src/modules/pacientes/types.ts
 * @description Tipos de dominio para el modulo de Pacientes
 */

export interface Paciente {
  pacienteId: number;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;  // formato ISO: "YYYY-MM-DD"
  sexo: "M" | "F";          // Tipo union: solo puede ser M o F
  direccion: string;
  telefono: string;
  correoElectronico: string;
}

export type CreatePacienteDTO = Omit<Paciente, "pacienteId">;
export type UpdatePacienteDTO = Partial<CreatePacienteDTO>;

export interface PacienteFilters {
  nombre?: string;
  apellido?: string;
  sexo?: "M" | "F";
}