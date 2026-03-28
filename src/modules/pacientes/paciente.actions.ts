"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type FormState = { success: boolean; message: string; errors?: Record<string, string[]> };

const CreatePacienteSchema = z.object({
  nombre:            z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  apellido:          z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  fechaNacimiento:   z.string().min(1, "La fecha de nacimiento es obligatoria"),
  sexo:              z.enum(["M", "F"], { message: "Seleccione un sexo válido" }),
  direccion:         z.string().min(5, "La dirección debe tener al menos 5 caracteres"),
  telefono:          z.string().regex(/^[0-9]{7,10}$/, "Teléfono inválido. Solo dígitos, 7-10 caracteres"),
  correoElectronico: z.string().email("Correo electrónico inválido"),
});

export async function createPacienteAction(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const rawData = {
    nombre:            formData.get("nombre")            as string,
    apellido:          formData.get("apellido")          as string,
    fechaNacimiento:   formData.get("fechaNacimiento")   as string,
    sexo:              formData.get("sexo")              as string,
    direccion:         formData.get("direccion")         as string,
    telefono:          formData.get("telefono")          as string,
    correoElectronico: formData.get("correoElectronico") as string,
  };

  const validation = CreatePacienteSchema.safeParse(rawData);
  if (!validation.success) {
    return { success: false, message: "Por favor corrija los errores del formulario", errors: validation.error.flatten().fieldErrors };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("pacientes").insert({
    nombre:            validation.data.nombre,
    apellido:          validation.data.apellido,
    fechanacimiento:   validation.data.fechaNacimiento,
    sexo:              validation.data.sexo,
    direccion:         validation.data.direccion,
    telefono:          validation.data.telefono,
    correoelectronico: validation.data.correoElectronico,
  });

  if (error) return { success: false, message: error.message };

  revalidatePath("/dashboard/pacientes");
  revalidatePath("/dashboard");
  redirect("/dashboard/pacientes");
}

export async function deletePacienteAction(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const id = Number(formData.get("id"));
  if (!id || isNaN(id)) return { success: false, message: "ID inválido" };

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("pacientes").delete().eq("pacienteid", id);
  if (error) return { success: false, message: error.message };

  revalidatePath("/dashboard/pacientes");
  revalidatePath("/dashboard");
  return { success: true, message: "Paciente eliminado exitosamente" };
}