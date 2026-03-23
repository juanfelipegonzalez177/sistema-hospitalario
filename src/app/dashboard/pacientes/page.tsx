import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Plus } from "lucide-react";

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
        <button className="flex items-center gap-2 px-4 py-2 bg-green-600
          hover:bg-green-700 text-white text-sm font-medium rounded-lg">
          <Plus size={16} />
          Nuevo Paciente
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Nombre</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Fecha Nacimiento</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Sexo</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Telefono</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Correo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(pacientes || []).map((p) => (
              <tr key={p.pacienteid} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">
                  {p.nombre} {p.apellido}
                </td>
                <td className="px-4 py-3 text-gray-600">{p.fechanacimiento}</td>
                <td className="px-4 py-3 text-gray-600">
                  {p.sexo === "M" ? "Masculino" : "Femenino"}
                </td>
                <td className="px-4 py-3 text-gray-600">{p.telefono}</td>
                <td className="px-4 py-3 text-gray-600">{p.correoelectronico}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}