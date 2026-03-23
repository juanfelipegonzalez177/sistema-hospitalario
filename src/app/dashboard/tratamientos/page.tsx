import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata = { title: "Tratamientos" };

export default async function TratamientosPage() {
  const supabase = await createServerSupabaseClient();
  const { data: tratamientos } = await supabase
    .from("tratamientos")
    .select(`
      tratamientoid, fechainicio, fechafin,
      visitas!visitaid(
        fecha,
        pacientes!pacienteid(nombre, apellido)
      )
    `)
    .order("fechainicio", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tratamientos</h1>
          <p className="text-sm text-gray-500 mt-1">
            {tratamientos?.length || 0} tratamientos registrados
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Paciente</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Fecha Inicio</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Fecha Fin</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(tratamientos || []).map((t) => (
              <tr key={t.tratamientoid} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {(t.visitas as any)?.pacientes?.nombre}{" "}
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {(t.visitas as any)?.pacientes?.apellido}
                </td>
                <td className="px-4 py-3 text-gray-600">{t.fechainicio}</td>
                <td className="px-4 py-3 text-gray-600">{t.fechafin || "—"}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    t.fechafin
                      ? "bg-gray-100 text-gray-600"
                      : "bg-green-100 text-green-700"
                  }`}>
                    {t.fechafin ? "Finalizado" : "En curso"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}