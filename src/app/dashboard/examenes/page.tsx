import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata = { title: "Examenes" };

export default async function ExamenesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: examenes } = await supabase
    .from("orden_examenes")
    .select(`
      ordenexamenid, fecha,
      visitas!visitaid(
        pacientes!pacienteid(nombre, apellido)
      ),
      detallesexamenes(tipoexamen, nombreexamen, indicaciones)
    `)
    .order("fecha", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Examenes</h1>
          <p className="text-sm text-gray-500 mt-1">
            {examenes?.length || 0} ordenes registradas
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Paciente</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Tipo</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Examen</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Indicaciones</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(examenes || []).map((e) =>
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (e.detallesexamenes as any[]).map((d, i) => (
                <tr key={`${e.ordenexamenid}-${i}`} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {(e.visitas as any)?.pacientes?.nombre}{" "}
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {(e.visitas as any)?.pacientes?.apellido}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{d.tipoexamen}</td>
                  <td className="px-4 py-3 text-gray-600">{d.nombreexamen}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{d.indicaciones}</td>
                  <td className="px-4 py-3 text-gray-600">{e.fecha}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}