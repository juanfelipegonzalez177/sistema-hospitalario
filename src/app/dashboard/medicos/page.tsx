import { MedicoRepository } from "@/modules/medicos/medico.repository";
import { MedicoFormModal } from "./_components/MedicoFormModal";
import { MedicosTable } from "./_components/MedicosTable";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata = { title: "Medicos" };

export default async function MedicosPage() {
  const repo = new MedicoRepository();
  const medicos = await repo.findAll();

  const supabase = await createServerSupabaseClient();
  const { data: especialidades } = await supabase.from("especialidades").select("especialidadid, nombre").order("nombre");
  const { data: hospitales } = await supabase.from("hospitales").select("hospitalid, nombre").order("nombre");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medicos</h1>
          <p className="text-sm text-gray-500 mt-1">
            {medicos.length} medico{medicos.length !== 1 ? "s" : ""} registrados
          </p>
        </div>
        <MedicoFormModal
          mode="create"
          especialidades={especialidades || []}
          hospitales={hospitales || []}
        />
      </div>
      {medicos.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No hay médicos registrados</p>
          <p className="text-sm mt-1">Haz clic en "Nuevo Médico" para agregar uno.</p>
        </div>
      ) : (
        <MedicosTable medicos={medicos} />
      )}
    </div>
  );
}