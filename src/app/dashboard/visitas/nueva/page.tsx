"use client";

import { useActionState } from "react";
import { createVisitaAction } from "@/modules/visitas/visita.actions";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

interface Paciente { pacienteid: number; nombre: string; apellido: string; }
interface Medico { medicoid: number; nombre: string; apellido: string; }
interface Motivo { motivoid: number; descripcion: string; }

export default function NuevaVisitaPage() {
  const [state, formAction, isPending] = useActionState(createVisitaAction, null);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [medicos, setMedicos]     = useState<Medico[]>([]);
  const [motivos, setMotivos]     = useState<Motivo[]>([]);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    Promise.all([
      supabase.from("pacientes").select("pacienteid, nombre, apellido").order("apellido"),
      supabase.from("medicos").select("medicoid, nombre, apellido").order("apellido"),
      supabase.from("motivosvisitas").select("motivoid, descripcion"),
    ]).then(([p, m, mo]) => {
      setPacientes(p.data || []);
      setMedicos(m.data || []);
      setMotivos(mo.data || []);
    });
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Registrar Nueva Visita Medica</h1>

      <form action={formAction} className="space-y-6">

        {/* SECCION 1: Datos de la consulta */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-green-700 mb-4 pb-2 border-b border-gray-100">
            Datos de la Consulta
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Paciente *</label>
              <select
                name="pacienteId"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Seleccione un paciente</option>
                {pacientes.map((p) => (
                  <option key={p.pacienteid} value={p.pacienteid}>
                    {p.nombre} {p.apellido}
                  </option>
                ))}
              </select>
              {state?.errors?.pacienteId && (
                <p className="text-red-500 text-xs mt-1">{state.errors.pacienteId[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Medico *</label>
              <select
                name="medicoId"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Seleccione un medico</option>
                {medicos.map((m) => (
                  <option key={m.medicoid} value={m.medicoid}>
                    Dr. {m.nombre} {m.apellido}
                  </option>
                ))}
              </select>
              {state?.errors?.medicoId && (
                <p className="text-red-500 text-xs mt-1">{state.errors.medicoId[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha *</label>
              <input
                name="fecha"
                type="date"
                required
                defaultValue={new Date().toISOString().split("T")[0]}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hora *</label>
              <input
                name="hora"
                type="time"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </section>

        {/* SECCION 2: Diagnostico */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-green-700 mb-4 pb-2 border-b border-gray-100">
            Diagnostico y Motivo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Motivo de consulta</label>
              <select
                name="motivoId"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Seleccione un motivo</option>
                {motivos.map((m) => (
                  <option key={m.motivoid} value={m.motivoid}>
                    {m.descripcion}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Diagnostico</label>
              <textarea
                name="diagnostico"
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Describa el diagnostico del paciente..."
              />
            </div>
          </div>
        </section>

        {/* SECCION 3: Signos Vitales */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-green-700 mb-4 pb-2 border-b border-gray-100">
            Signos Vitales <span className="text-gray-400 font-normal text-xs">(opcional)</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Frec. Cardiaca (bpm)</label>
              <input name="frecuenciaCardiaca" type="number" min="30" max="300" placeholder="72" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Presion Arterial</label>
              <input name="presionArterial" type="text" placeholder="120/80" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Frec. Respiratoria (/min)</label>
              <input name="frecuenciaRespiratoria" type="number" min="5" max="60" placeholder="16" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Temperatura (C)</label>
              <input name="temperatura" type="number" min="32" max="45" step="0.1" placeholder="36.5" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Saturacion O2 (%)</label>
              <input name="saturacionOxigeno" type="number" min="0" max="100" step="0.1" placeholder="98.0" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
        </section>

        {/* Error general */}
        {state && !state.success && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
            {state.message}
          </div>
        )}

        {/* Botones */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => history.back()}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? "Registrando..." : "Registrar Visita"}
          </button>
        </div>
      </form>
    </div>
  );
}