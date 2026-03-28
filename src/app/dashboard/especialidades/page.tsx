import { createServerSupabaseClient } from "@/lib/supabase/server";
import { EspecialidadFormModal } from "./_components/EspecialidadFormModal";
import { EspecialidadesTable } from "./_components/EspecialidadesTable";

export const metadata = { title: "Especialidades" };

export default async function EspecialidadesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: especialidades } = await supabase.from("especialidades").select("*").order("nombre");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Especialidades</h1>
          <p className="text-sm text-gray-500 mt-1">{especialidades?.length || 0} especialidades registradas</p>
        </div>
        <EspecialidadFormModal mode="create" />
      </div>
      {especialidades?.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No hay especialidades registradas</p>
        </div>
      ) : (
        <EspecialidadesTable especialidades={especialidades || []} />
      )}
    </div>
  );
}