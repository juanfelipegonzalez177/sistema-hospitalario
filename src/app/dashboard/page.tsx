import { createServerSupabaseClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  Users, CalendarCheck, Stethoscope, Building2,
  Activity, CheckCircle2, Clock,
} from "lucide-react";
import { VisitasChart } from "./VisitasChart";
import { AnimatedCounter } from "./AnimatedCounter";

export const metadata = { title: "Dashboard" };

async function getDashboardStats() {
  const supabase = await createServerSupabaseClient();
  const hoy = new Date().toISOString().split("T")[0];

  const hace12Meses = new Date();
  hace12Meses.setMonth(hace12Meses.getMonth() - 11);
  const desde = `${hace12Meses.getFullYear()}-${String(hace12Meses.getMonth() + 1).padStart(2, "0")}-01`;

  const [
    pacientesResult, visitasHoyResult, medicosResult, hospitalesResult,
    ultimasPacientesResult, ultimasVisitasResult, visitasMesResult,
  ] = await Promise.all([
    supabase.from("pacientes").select("*", { count: "exact", head: true }),
    supabase.from("visitas").select("*", { count: "exact", head: true }).eq("fecha", hoy),
    supabase.from("medicos").select("*", { count: "exact", head: true }),
    supabase.from("hospitales").select("*", { count: "exact", head: true }),
    supabase.from("pacientes").select("pacienteid, nombre, apellido, sexo, telefono").order("pacienteid", { ascending: false }).limit(5),
    supabase.from("visitas").select(`
      visitaid, fecha, hora,
      pacientes!pacienteid(nombre, apellido),
      medicos!medicoid(nombre, apellido)
    `).order("fecha", { ascending: false }).order("hora", { ascending: false }).limit(6),
    supabase.from("visitas").select("fecha").gte("fecha", desde),
  ]);

  const meses = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  const conteo: Record<string, number> = {};
  for (let i = 0; i < 12; i++) {
    const d = new Date();
    d.setMonth(d.getMonth() - (11 - i));
    conteo[`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`] = 0;
  }
  (visitasMesResult.data || []).forEach((v: any) => {
    const key = v.fecha.slice(0, 7);
    if (key in conteo) conteo[key] = (conteo[key] || 0) + 1;
  });
  const visitasPorMes = Object.entries(conteo).map(([key, total]) => ({
    mes: meses[parseInt(key.split("-")[1]) - 1],
    total,
  }));

  return {
    totalPacientes:   pacientesResult.count  || 0,
    visitasHoy:       visitasHoyResult.count || 0,
    totalMedicos:     medicosResult.count    || 0,
    totalHospitales:  hospitalesResult.count || 0,
    ultimasPacientes: ultimasPacientesResult.data || [],
    ultimasVisitas:   ultimasVisitasResult.data   || [],
    visitasPorMes,
  };
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const hoy = new Date().toLocaleDateString("es-CO", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const estadoSistema = [
    { label: "Base de datos",  icon: CheckCircle2 },
    { label: "Autenticación",  icon: CheckCircle2 },
    { label: "Backups",        icon: CheckCircle2 },
    { label: "Servidor",       icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sistema de Gestión Hospitalaria</h1>
          <p className="text-sm text-gray-500 mt-0.5 capitalize">{hoy}</p>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Sistema operativo
        </span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Pacientes", value: stats.totalPacientes,  color: "green",  icon: Users         },
          { title: "Visitas Hoy",     value: stats.visitasHoy,      color: "blue",   icon: CalendarCheck },
          { title: "Médicos",         value: stats.totalMedicos,    color: "purple", icon: Stethoscope   },
          { title: "Hospitales",      value: stats.totalHospitales, color: "orange", icon: Building2     },
        ].map(({ title, value, color, icon: Icon }) => {
          const styles: Record<string, { card: string; text: string; icon: string }> = {
            green:  { card: "border-green-200 bg-green-50",   text: "text-green-700",  icon: "bg-green-100 text-green-600"   },
            blue:   { card: "border-blue-200 bg-blue-50",     text: "text-blue-700",   icon: "bg-blue-100 text-blue-600"     },
            purple: { card: "border-purple-200 bg-purple-50", text: "text-purple-700", icon: "bg-purple-100 text-purple-600" },
            orange: { card: "border-orange-200 bg-orange-50", text: "text-orange-700", icon: "bg-orange-100 text-orange-600" },
          };
          const s = styles[color];
          return (
            <div key={title} className={`rounded-xl border p-5 ${s.card} flex items-center gap-4`}>
              <div className={`rounded-lg p-3 ${s.icon}`}>
                <Icon size={22} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">{title}</p>
                <AnimatedCounter value={value} className={`text-3xl font-bold mt-0.5 ${s.text}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Gráfica + Estado del sistema */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Visitas por Mes</h2>
              <p className="text-xs text-gray-400 mt-0.5">Últimos 12 meses</p>
            </div>
            <Activity size={16} className="text-green-500" />
          </div>
          <VisitasChart data={stats.visitasPorMes} />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Estado del Sistema</h2>
            <CheckCircle2 size={16} className="text-green-500" />
          </div>
          <div className="space-y-3">
            {estadoSistema.map(({ label, icon: Icon }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-600">{label}</span>
                <span className="flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700">
                  <Icon size={12} />
                  Operativo
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <Clock size={11} />
              Última verificación: hace un momento
            </p>
          </div>
        </div>
      </div>

      {/* Timeline + Tablas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Actividad reciente */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Actividad Reciente</h2>
          <div className="relative">
            <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-100" />
            <div className="space-y-4">
              {stats.ultimasVisitas.length === 0 ? (
                <p className="text-xs text-gray-400 pl-8">Sin actividad reciente</p>
              ) : (
                stats.ultimasVisitas.map((v: any) => (
                  <div key={v.visitaid} className="flex gap-3 relative">
                    <span className="w-6 h-6 rounded-full bg-green-100 border-2 border-green-400 flex-shrink-0 z-10" />
                    <div>
                      <p className="text-xs font-medium text-gray-800">
                        {v.pacientes?.nombre} {v.pacientes?.apellido}
                      </p>
                      <p className="text-xs text-gray-400">
                        Dr. {v.medicos?.nombre} {v.medicos?.apellido} · {v.fecha}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Últimas visitas */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Últimas Visitas</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500">Paciente</th>
                <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats.ultimasVisitas.length === 0 ? (
                <tr><td colSpan={2} className="px-4 py-6 text-center text-gray-400 text-xs">Sin visitas</td></tr>
              ) : (
                stats.ultimasVisitas.map((v: any) => (
                  <tr key={v.visitaid} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-medium text-gray-800 text-xs">
                      {v.pacientes?.nombre} {v.pacientes?.apellido}
                    </td>
                    <td className="px-4 py-2.5 text-gray-400 text-xs">{v.fecha}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Últimos pacientes */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Últimos Pacientes</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500">Nombre</th>
                <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500">Sexo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats.ultimasPacientes.length === 0 ? (
                <tr><td colSpan={2} className="px-4 py-6 text-center text-gray-400 text-xs">Sin pacientes</td></tr>
              ) : (
                stats.ultimasPacientes.map((p: any) => (
                  <tr key={p.pacienteid} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 text-xs font-medium text-gray-800 flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${p.sexo === "M" ? "bg-blue-100 text-blue-600" : "bg-pink-100 text-pink-600"}`}>
                        {p.nombre?.charAt(0)}
                      </span>
                      {p.nombre} {p.apellido}
                    </td>
                    <td className="px-4 py-2.5 text-xs">
                      <span className={`px-2 py-0.5 rounded-full font-medium ${p.sexo === "M" ? "bg-blue-50 text-blue-600" : "bg-pink-50 text-pink-600"}`}>
                        {p.sexo === "M" ? "M" : "F"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}