"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type FormState = { success: boolean; message: string; errors?: Record<string, string[]> };

const CreateMedicamentoSchema = z.object({
  nombre:      z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  prescripcion: z.string().min(3, "La prescripción es obligatoria"),
  cantidad:    z.coerce.number().positive("La cantidad debe ser mayor a 0"),
  unidades:    z.string().min(1, "Seleccione las unidades"),
  descripcion: z.string().optional(),
});

export async function createMedicamentoAction(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const rawData = {
    nombre:      formData.get("nombre")      as string,
    prescripcion: formData.get("prescripcion") as string,
    cantidad:    formData.get("cantidad")    as string,
    unidades:    formData.get("unidades")    as string,
    descripcion: formData.get("descripcion") as string,
  };

  const validation = CreateMedicamentoSchema.safeParse(rawData);
  if (!validation.success) {
    return { success: false, message: "Por favor corrija los errores", errors: validation.error.flatten().fieldErrors };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("medicamentos").insert({
    nombre:      validation.data.nombre,
    prescripcion: validation.data.prescripcion,
    cantidad:    validation.data.cantidad,
    unidades:    validation.data.unidades,
    descripcion: validation.data.descripcion || null,
  });

  if (error) return { success: false, message: error.message };

  revalidatePath("/dashboard/medicamentos");
  redirect("/dashboard/medicamentos");
}

export async function deleteMedicamentoAction(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const id = Number(formData.get("id"));
  if (!id || isNaN(id)) return { success: false, message: "ID inválido" };

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("medicamentos").delete().eq("medicamentoid", id);
  if (error) return { success: false, message: error.message };

  revalidatePath("/dashboard/medicamentos");
  return { success: true, message: "Medicamento eliminado exitosamente" };
}