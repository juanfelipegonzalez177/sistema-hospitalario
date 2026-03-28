"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type FormState = { success: boolean; message: string; errors?: Record<string, string[]> };

const CreateEspecialidadSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
});

export async function createEspecialidadAction(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const validation = CreateEspecialidadSchema.safeParse({ nombre: formData.get("nombre") as string });
  if (!validation.success) {
    return { success: false, message: "Por favor corrija los errores", errors: validation.error.flatten().fieldErrors };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("especialidades").insert({ nombre: validation.data.nombre });
  if (error) return { success: false, message: error.message };

  revalidatePath("/dashboard/especialidades");
  redirect("/dashboard/especialidades");
}

export async function deleteEspecialidadAction(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const id = Number(formData.get("id"));
  if (!id || isNaN(id)) return { success: false, message: "ID inválido" };

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("especialidades").delete().eq("especialidadid", id);
  if (error) return { success: false, message: error.message };

  revalidatePath("/dashboard/especialidades");
  return { success: true, message: "Especialidad eliminada exitosamente" };
}