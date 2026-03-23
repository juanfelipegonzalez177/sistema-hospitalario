"use client";

import { useState, useActionState } from "react";
import { createHospitalAction } from "@/modules/hospitales/hospital.actions";
import { X, Plus } from "lucide-react";

interface Props {
  mode: "create" | "edit";
}

export function HospitalFormModal({ mode }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(
    createHospitalAction,
    null
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-green-600
          hover:bg-green-700 text-white text-sm font-medium
          rounded-lg transition-colors"
      >
        <Plus size={16} />
        Nuevo Hospital
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative bg-white rounded-xl shadow-xl
            w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900">
                {mode === "create" ? "Nuevo Hospital" : "Editar Hospital"}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg
                  hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form action={formAction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  name="nombre"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2
                    text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Hospital Central"
                />
                {state?.errors?.nombre && (
                  <p className="text-red-500 text-xs mt-1">
                    {state.errors.nombre[0]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Direccion *
                </label>
                <input
                  name="direccion"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2
                    text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Calle 123, Bogota"
                />
                {state?.errors?.direccion && (
                  <p className="text-red-500 text-xs mt-1">
                    {state.errors.direccion[0]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NIT *
                </label>
                <input
                  name="nit"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2
                    text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="800123456-7"
                />
                {state?.errors?.nit && (
                  <p className="text-red-500 text-xs mt-1">
                    {state.errors.nit[0]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefono *
                </label>
                <input
                  name="telefono"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2
                    text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="6012345678"
                />
                {state?.errors?.telefono && (
                  <p className="text-red-500 text-xs mt-1">
                    {state.errors.telefono[0]}
                  </p>
                )}
              </div>

              {state && !state.success && (
                <p className="text-red-600 text-sm">{state.message}</p>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm text-gray-600 border
                    border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 text-sm font-medium text-white
                    bg-green-600 hover:bg-green-700 rounded-lg
                    disabled:opacity-50 transition-colors"
                >
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