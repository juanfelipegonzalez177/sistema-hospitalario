"use client";

import { useState, useActionState } from "react";
import { createMedicoAction } from "@/modules/medicos/medico.actions";
import { X, Plus } from "lucide-react";

interface Props {
  mode: "create" | "edit";
  especialidades: { especialidadid: number; nombre: string }[];
  hospitales: { hospitalid: number; nombre: string }[];
}

export function MedicoFormModal({ mode, especialidades, hospitales }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createMedicoAction, null);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
      >
        <Plus size={16} />
        Nuevo Medico
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900">Nuevo Medico</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            <form action={formAction} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input name="nombre" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Juan" />
                  {state?.errors?.nombre && <p className="text-red-500 text-xs mt-1">{state.errors.nombre[0]}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apellido *</label>
                  <input name="apellido" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Pérez" />
                  {state?.errors?.apellido && <p className="text-red-500 text-xs mt-1">{state.errors.apellido[0]}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Especialidad *</label>
                <select name="especialidadId" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">Seleccione una especialidad</option>
                  {especialidades.map((e) => (
                    <option key={e.especialidadid} value={e.especialidadid}>{e.nombre}</option>
                  ))}
                </select>
                {state?.errors?.especialidadId && <p className="text-red-500 text-xs mt-1">{state.errors.especialidadId[0]}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hospital *</label>
                <select name="hospitalId" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">Seleccione un hospital</option>
                  {hospitales.map((h) => (
                    <option key={h.hospitalid} value={h.hospitalid}>{h.nombre}</option>
                  ))}
                </select>
                {state?.errors?.hospitalId && <p className="text-red-500 text-xs mt-1">{state.errors.hospitalId[0]}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefono *</label>
                  <input name="telefono" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="3001234567" />
                  {state?.errors?.telefono && <p className="text-red-500 text-xs mt-1">{state.errors.telefono[0]}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo *</label>
                  <input name="correoElectronico" type="email" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="medico@hospital.com" />
                  {state?.errors?.correoElectronico && <p className="text-red-500 text-xs mt-1">{state.errors.correoElectronico[0]}</p>}
                </div>
              </div>

              {state && !state.success && <p className="text-red-600 text-sm">{state.message}</p>}

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Cancelar</button>
                <button type="submit" disabled={isPending} className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg disabled:opacity-50 transition-colors">
                  {isPending ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}