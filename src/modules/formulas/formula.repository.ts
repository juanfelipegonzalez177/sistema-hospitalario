/**
 * @file src/modules/formulas/formula.repository.ts
 *
 * @description Repositorio para Formulas (recetas medicas).
 *
 * Relacion: Tratamientos -> Formulas -> DetallesFormulas -> Medicamentos
 */

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Formula, CreateFormulaDTO } from "./types";

const FORMULA_SELECT = `
  formulaid, fecha,
  tratamientoid,
  detallesformulas(
    detalleid,
    presentacion,
    posologia,
    periodouso,
    periodicidaduso,
    medicamentos!medicamentoid(
      medicamentoid, nombre, prescripcion, unidades, descripcion
    )
  )
`;

export class FormulaRepository {
  /**
   * Obtiene todas las formulas de un tratamiento.
   * Incluye los medicamentos recetados en cada formula.
   */
  async findByTratamiento(tratamientoId: number): Promise<Formula[]> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("formulas")
      .select(FORMULA_SELECT)
      .eq("tratamientoid", tratamientoId)
      .order("fecha", { ascending: false });

    if (error) throw new Error(error.message);

    return (data || []).map((f) => ({
      formulaId:     f.formulaid,
      tratamientoId: f.tratamientoid,
      fecha:         f.fecha,
      detalles: (f.detallesformulas || []).map((d) => {
        const med = d.medicamentos as {
          medicamentoid: number;
          nombre: string;
          prescripcion: string;
          unidades: string;
          descripcion: string;
        };
        return {
          detalleId:       d.detalleid,
          presentacion:    d.presentacion,
          posologia:       d.posologia,
          periodoUso:      d.periodouso,
          periodicidadUso: d.periodicidaduso,
          medicamento: {
            medicamentoId: med.medicamentoid,
            nombre:        med.nombre,
            prescripcion:  med.prescripcion,
            unidades:      med.unidades,
            descripcion:   med.descripcion,
            cantidad:      0,
          },
        };
      }),
    }));
  }

  /**
   * Crea una formula con todos sus detalles (medicamentos recetados).
   */
  async createConDetalles(dto: CreateFormulaDTO): Promise<Formula> {
    const supabase = await createServerSupabaseClient();

    // 1. Crear la formula
    const { data: formula, error: fErr } = await supabase
      .from("formulas")
      .insert({
        tratamientoid: dto.tratamientoId,
        fecha:         dto.fecha,
      })
      .select("formulaid")
      .single();

    if (fErr) throw new Error(fErr.message);

    // 2. Crear los detalles si los hay
    if (dto.detalles && dto.detalles.length > 0) {
      const detallesInsert = dto.detalles.map((d) => ({
        formulaid:       formula!.formulaid,
        medicamentoid:   d.medicamentoId,
        presentacion:    d.presentacion,
        posologia:       d.posologia,
        periodouso:      d.periodoUso,
        periodicidaduso: d.periodicidadUso,
      }));

      const { error: dErr } = await supabase
        .from("detallesformulas")
        .insert(detallesInsert);

      if (dErr) throw new Error(`Error en detalles formula: ${dErr.message}`);
    }

    // 3. Retornar la formula completa
    const formulas = await this.findByTratamiento(dto.tratamientoId);
    return formulas.find((f) => f.formulaId === formula!.formulaid)!;
  }
}