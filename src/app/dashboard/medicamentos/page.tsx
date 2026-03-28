import { createServerSupabaseClient } from "@/lib/supabase/server";
import { MedicamentoFormModal } from "./_components/MedicamentoFormModal";
import { MedicamentosTable } from "./_components/MedicamentosTable";

export const metadata = { title: "Medicamentos" };

export default async function MedicamentosPage() {
  const supabase = await createServerSupabaseClient();
  const { data: medicamentos } = await supabase.from("medicamentos").select("*").order("nombre");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medicamentos</h1>
          <p className="text-sm text-gray-500 mt-1">{medicamentos?.length || 0} medicamentos registrados</p>
        </div>
        <MedicamentoFormModal mode="create" />
      </div>
      {medicamentos?.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No hay medicamentos registrados</p>
        </div>
      ) : (
        <MedicamentosTable medicamentos={medicamentos || []} />
      )}
    </div>
  );
}