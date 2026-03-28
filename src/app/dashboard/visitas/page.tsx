import { createServerSupabaseClient } from "@/lib/supabase/server";
import Link from "next/link";

export const metadata = { title: "Visitas" };

async function getVisitas() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("visitas")
    .select(`
      visitaid, fecha, hora,
      pacientes!pacienteid(nombre, apellido),
      medicos!medicoid(nombre, apellido)
    `)
    .order("fecha", { ascending: false })
    .order("hora", { ascending: false });
  return data || [];
}

export default async function VisitasPage() {
  const visitas = await getVisitas();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Visitas</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {visitas.length} visita{visitas.length !== 1 ? "s" : ""} registrada{visitas.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/dashboard/visitas/nuevo"
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Nueva Visita
        </Link>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Paciente</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Medico</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Fecha</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Hora</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {visitas.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-400 text-xs">
                  No hay visitas registradas
                </td>
              </tr>
            ) : (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              visitas.map((v: any) => (
                <tr key={v.visitaid} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-900">
                    {v.pacientes?.nombre} {v.pacientes?.apellido}
                  </td>
                  <td className="px-6 py-3 text-green-700">
                    Dr. {v.medicos?.nombre} {v.medicos?.apellido}
                  </td>
                  <td className="px-6 py-3 text-gray-600">{v.fecha}</td>
                  <td className="px-6 py-3 text-gray-600">{v.hora}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}