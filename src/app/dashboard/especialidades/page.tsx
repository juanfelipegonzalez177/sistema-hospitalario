import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Plus } from "lucide-react";

export const metadata = { title: "Especialidades" };

export default async function EspecialidadesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: especialidades } = await supabase
    .from("especialidades")
    .select("*")
    .order("nombre");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Especialidades</h1>
          <p className="text-sm text-gray-500 mt-1">
            {especialidades?.length || 0} especialidades registradas
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-green-600
          hover:bg-green-700 text-white text-sm font-medium rounded-lg">
          <Plus size={16} />
          Nueva Especialidad
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">ID</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Nombre</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(especialidades || []).map((e) => (
              <tr key={e.especialidadid} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500">{e.especialidadid}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{e.nombre}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}