"use client";

import { useState, useActionState } from "react";
import { createPacienteAction } from "@/modules/pacientes/paciente.actions";
import { X, Plus } from "lucide-react";

export function PacienteFormModal({ mode }: { mode: "create" | "edit" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createPacienteAction, null);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
      >
        <Plus size={16} />
        Nuevo Paciente
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900">Nuevo Paciente</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            <form action={formAction} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input name="nombre" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Carlos" />
                  {state?.errors?.nombre && <p className="text-red-500 text-xs mt-1">{state.errors.nombre[0]}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apellido *</label>
                  <input name="apellido" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Martínez" />
                  {state?.errors?.apellido && <p className="text-red-500 text-xs mt-1">{state.errors.apellido[0]}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento *</label>
                  <input name="fechaNacimiento" type="date" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                  {state?.errors?.fechaNacimiento && <p className="text-red-500 text-xs mt-1">{state.errors.fechaNacimiento[0]}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sexo *</label>
                  <select name="sexo" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option value="">Seleccione</option>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                  </select>
                  {state?.errors?.sexo && <p className="text-red-500 text-xs mt-1">{state.errors.sexo[0]}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Direccion *</label>
                <input name="direccion" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Calle 10, Bogotá" />
                {state?.errors?.direccion && <p className="text-red-500 text-xs mt-1">{state.errors.direccion[0]}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefono *</label>
                  <input name="telefono" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="3101234567" />
                  {state?.errors?.telefono && <p className="text-red-500 text-xs mt-1">{state.errors.telefono[0]}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo *</label>
                  <input name="correoElectronico" type="email" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="correo@gmail.com" />
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