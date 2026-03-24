"use server";

import { revalidatePath } from "next/cache";
import { redirect }       from "next/navigation";
import { z }              from "zod";
import { VisitaRepository } from "@/modules/visitas/visita.repository";

// Schema de validacion para la visita completa
const CreateVisitaSchema = z.object({
  pacienteId:  z.coerce.number().positive("Seleccione un paciente"),
  medicoId:    z.coerce.number().positive("Seleccione un medico"),
  fecha:       z.string().min(1, "Fecha requerida"),
  hora:        z.string().min(1, "Hora requerida"),
  motivoId:    z.coerce.number().optional(),
  diagnostico: z.string().optional(),
  frecuenciaCardiaca:     z.coerce.number().optional(),
  presionArterial:        z.string().optional(),
  frecuenciaRespiratoria: z.coerce.number().optional(),
  temperatura:            z.coerce.number().optional(),
  saturacionOxigeno:      z.coerce.number().optional(),
});

export async function createVisitaAction(
  _prevState: unknown,
  formData: FormData
) {
  // Extraer todos los campos del formulario
  const rawData = Object.fromEntries(
    Array.from(formData.entries()).map(([key, val]) => [key, val])
  );

  console.log("rawData:", rawData);

  // Validar con Zod
  const validation = CreateVisitaSchema.safeParse(rawData);

  console.log("validation:", validation);

  if (!validation.success) {
    return {
      success: false,
      message: "Errores en el formulario",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const d = validation.data;
  const repo = new VisitaRepository();

  // Construir el DTO de visita completa
  const visitaDTO = {
    pacienteId:  d.pacienteId,
    medicoId:    d.medicoId,
    fecha:       d.fecha,
    hora:        d.hora,
    motivoId:    d.motivoId,
    diagnostico: d.diagnostico,
    // Solo incluir signos vitales si se proporcionaron
    signosVitales: d.frecuenciaCardiaca ? {
      frecuenciaCardiaca:     d.frecuenciaCardiaca,
      presionArterial:        d.presionArterial!,
      frecuenciaRespiratoria: d.frecuenciaRespiratoria!,
      temperatura:            d.temperatura!,
      saturacionOxigeno:      d.saturacionOxigeno!,
    } : undefined,
  };

  try {
    await repo.createCompleta(visitaDTO);
  } catch (err) {
    console.error("Error creando visita:", err);
    return {
      success: false,
      message: err instanceof Error ? err.message : "Error al crear visita",
    };
  }

  revalidatePath("/dashboard/visitas");
  revalidatePath(`/dashboard/pacientes/${d.pacienteId}`);
  redirect("/dashboard/visitas");
}