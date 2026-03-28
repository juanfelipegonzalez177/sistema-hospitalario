"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type FormState = { success: boolean; message: string; errors?: Record<string, string[]> };

const CreateMedicoSchema = z.object({
  nombre:            z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  apellido:          z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  especialidadId:    z.coerce.number().positive("Seleccione una especialidad"),
  hospitalId:        z.coerce.number().positive("Seleccione un hospital"),
  telefono:          z.string().regex(/^[0-9]{7,10}$/, "Teléfono inválido"),
  correoElectronico: z.string().email("Correo electrónico inválido"),
});

export async function createMedicoAction(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const rawData = {
    nombre:            formData.get("nombre")            as string,
    apellido:          formData.get("apellido")          as string,
    especialidadId:    formData.get("especialidadId")    as string,
    hospitalId:        formData.get("hospitalId")        as string,
    telefono:          formData.get("telefono")          as string,
    correoElectronico: formData.get("correoElectronico") as string,
  };

  const validation = CreateMedicoSchema.safeParse(rawData);
  if (!validation.success) {
    return { success: false, message: "Por favor corrija los errores del formulario", errors: validation.error.flatten().fieldErrors };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("medicos").insert({
    nombre:            validation.data.nombre,
    apellido:          validation.data.apellido,
    especialidadid:    validation.data.especialidadId,
    hospitalid:        validation.data.hospitalId,
    telefono:          validation.data.telefono,
    correoelectronico: validation.data.correoElectronico,
  });

  if (error) return { success: false, message: error.message };

  revalidatePath("/dashboard/medicos");
  revalidatePath("/dashboard");
  redirect("/dashboard/medicos");
}

export async function deleteMedicoAction(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const id = Number(formData.get("id"));
  if (!id || isNaN(id)) return { success: false, message: "ID inválido" };

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("medicos").delete().eq("medicoid", id);
  if (error) return { success: false, message: error.message };

  revalidatePath("/dashboard/medicos");
  revalidatePath("/dashboard");
  return { success: true, message: "Médico eliminado exitosamente" };
}