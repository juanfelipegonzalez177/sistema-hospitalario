/**
 * @file src/app/(dashboard)/page.tsx
 */

import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const hoy = new Date().toISOString().split("T")[0];

  const [
    pacientesResult,
    visitasHoyResult,
    medicosResult,
    hospitalesResult,
  ] = await Promise.all([
    supabase.from("pacientes").select("*", { count: "exact", head: true }),
    supabase.from("visitas").select("*", { count: "exact", head: true }).eq("fecha", hoy),
    supabase.from("medicos").select("*", { count: "exact", head: true }),
    supabase.from("hospitales").select("*", { count: "exact", head: true }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Sistema de Gestion Hospitalaria
      </h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border p-6 bg-green-50 border-green-200">
          <p className="text-sm text-green-600">Total Pacientes</p>
          <p className="text-3xl font-bold text-green-600">{pacientesResult.count || 0}</p>
        </div>
        <div className="rounded-xl border p-6 bg-blue-50 border-blue-200">
          <p className="text-sm text-blue-600">Visitas Hoy</p>
          <p className="text-3xl font-bold text-blue-600">{visitasHoyResult.count || 0}</p>
        </div>
        <div className="rounded-xl border p-6 bg-purple-50 border-purple-200">
          <p className="text-sm text-purple-600">Medicos</p>
          <p className="text-3xl font-bold text-purple-600">{medicosResult.count || 0}</p>
        </div>
        <div className="rounded-xl border p-6 bg-orange-50 border-orange-200">
          <p className="text-sm text-orange-600">Hospitales</p>
          <p className="text-3xl font-bold text-orange-600">{hospitalesResult.count || 0}</p>
        </div>
      </div>
    </div>
  );
}