import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PacienteFormModal } from "./_components/PacienteFormModal";
import { PacientesTable } from "./_components/PacientesTable";

export const metadata = { title: "Pacientes" };

export default async function PacientesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: pacientes, error } = await supabase
    .from("pacientes")
    .select("*")
    .order("apellido", { ascending: true });

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-6">
        <h2 className="text-red-700 font-semibold">Error al cargar pacientes</h2>
        <p className="text-red-600 text-sm mt-1">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pacientes</h1>
          <p className="text-sm text-gray-500 mt-1">
            {pacientes?.length || 0} paciente{pacientes?.length !== 1 ? "s" : ""} registrados
          </p>
        </div>
        <PacienteFormModal mode="create" />
      </div>
      {pacientes?.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No hay pacientes registrados</p>
          <p className="text-sm mt-1">Haz clic en "Nuevo Paciente" para agregar uno.</p>
        </div>
      ) : (
        <PacientesTable pacientes={pacientes || []} />
      )}
    </div>
  );
}