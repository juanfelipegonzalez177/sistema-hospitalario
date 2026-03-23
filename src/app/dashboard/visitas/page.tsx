import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Plus } from "lucide-react";

export const metadata = { title: "Visitas" };

export default async function VisitasPage() {
  const supabase = await createServerSupabaseClient();

  const { data: visitas, error } = await supabase
    .from("visitas")
    .select(`
      visitaid, fecha, hora,
      pacientes!pacienteid(nombre, apellido),
      medicos!medicoid(nombre, apellido)
    `)
    .order("fecha", { ascending: false })
    .order("hora",  { ascending: false });

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-6">
        <h2 className="text-red-700 font-semibold">Error al cargar visitas</h2>
        <p className="text-red-600 text-sm mt-1">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Visitas</h1>
          <p className="text-sm text-gray-500 mt-1">
            {visitas?.length || 0} visitas registradas
          </p>
        </div>
        <Link
          href="/dashboard/visitas/nueva"
          className="flex items-center gap-2 px-4 py-2 bg-green-600
            hover:bg-green-700 text-white text-sm font-medium
            rounded-lg transition-colors"
        >
          <Plus size={16} />
          Nueva Visita
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Paciente</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Medico</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Fecha</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Hora</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(visitas || []).map((v) => (
              <tr key={v.visitaid} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {(v.pacientes as any)?.nombre} {(v.pacientes as any)?.apellido}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  Dr. {(v.medicos as any)?.nombre} {(v.medicos as any)?.apellido}
                </td>
                <td className="px-4 py-3 text-gray-600">{v.fecha}</td>
                <td className="px-4 py-3 text-gray-600">{v.hora}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}