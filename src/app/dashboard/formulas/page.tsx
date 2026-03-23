import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata = { title: "Formulas" };

export default async function FormulasPage() {
  const supabase = await createServerSupabaseClient();
  const { data: formulas } = await supabase
    .from("formulas")
    .select(`
      formulaid, fecha,
      tratamientos!tratamientoid(
        visitas!visitaid(
          pacientes!pacienteid(nombre, apellido)
        )
      )
    `)
    .order("fecha", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Formulas</h1>
          <p className="text-sm text-gray-500 mt-1">
            {formulas?.length || 0} formulas registradas
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">ID</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Paciente</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(formulas || []).map((f) => (
              <tr key={f.formulaid} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500">{f.formulaid}</td>
                <td className="px-4 py-3 font-medium text-gray-900">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {(f.tratamientos as any)?.visitas?.pacientes?.nombre}{" "}
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {(f.tratamientos as any)?.visitas?.pacientes?.apellido}
                </td>
                <td className="px-4 py-3 text-gray-600">{f.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}