"use client";

import { useState, useActionState } from "react";
import { createEspecialidadAction } from "@/modules/especialidades/especialidad.actions";
import { X, Plus } from "lucide-react";

export function EspecialidadFormModal({ mode }: { mode: "create" | "edit" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createEspecialidadAction, null);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors">
        <Plus size={16} />
        Nueva Especialidad
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900">Nueva Especialidad</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"><X size={18} /></button>
            </div>
            <form action={formAction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input name="nombre" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Ej: Cardiología" />
                {state?.errors?.nombre && <p className="text-red-500 text-xs mt-1">{state.errors.nombre[0]}</p>}
              </div>
              {state && !state.success && <p className="text-red-600 text-sm">{state.message}</p>}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Cancelar</button>
                <button type="submit" disabled={isPending} className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg disabled:opacity-50">{isPending ? "Guardando..." : "Guardar"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}