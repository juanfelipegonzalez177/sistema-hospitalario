import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Plus } from "lucide-react";

export const metadata = { title: "Medicamentos" };

export default async function MedicamentosPage() {
  const supabase = await createServerSupabaseClient();
  const { data: medicamentos } = await supabase
    .from("medicamentos")
    .select("*")
    .order("nombre");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medicamentos</h1>
          <p className="text-sm text-gray-500 mt-1">
            {medicamentos?.length || 0} medicamentos registrados
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-green-600
          hover:bg-green-700 text-white text-sm font-medium rounded-lg">
          <Plus size={16} />
          Nuevo Medicamento
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Nombre</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Prescripcion</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Cantidad</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Unidades</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(medicamentos || []).map((m) => (
              <tr key={m.medicamentoid} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{m.nombre}</td>
                <td className="px-4 py-3 text-gray-600">{m.prescripcion}</td>
                <td className="px-4 py-3 text-gray-600">{m.cantidad}</td>
                <td className="px-4 py-3 text-gray-600">{m.unidades}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}