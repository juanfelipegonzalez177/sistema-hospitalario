import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata = { title: "Incapacidades" };

export default async function IncapacidadesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: incapacidades } = await supabase
    .from("incapacidades")
    .select(`
      incapacidadid, fecha,
      tratamientos!tratamientoid(
        visitas!visitaid(
          pacientes!pacienteid(nombre, apellido)
        )
      ),
      detallesincapacidades(descripcion, numerodias, fechainicio, fechafin)
    `)
    .order("fecha", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Incapacidades</h1>
          <p className="text-sm text-gray-500 mt-1">
            {incapacidades?.length || 0} incapacidades registradas
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Paciente</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Descripcion</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Dias</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Inicio</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Fin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(incapacidades || []).map((inc) =>
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (inc.detallesincapacidades as any[]).map((d, i) => (
                <tr key={`${inc.incapacidadid}-${i}`} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {(inc.tratamientos as any)?.visitas?.pacientes?.nombre}{" "}
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {(inc.tratamientos as any)?.visitas?.pacientes?.apellido}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{d.descripcion}</td>
                  <td className="px-4 py-3 text-gray-600">{d.numerodias} días</td>
                  <td className="px-4 py-3 text-gray-600">{d.fechainicio}</td>
                  <td className="px-4 py-3 text-gray-600">{d.fechafin}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}