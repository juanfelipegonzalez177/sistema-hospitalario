"use client";

import { useState, useActionState } from "react";
import { createMedicamentoAction } from "@/modules/medicamentos/medicamento.actions";
import { X, Plus } from "lucide-react";

export function MedicamentoFormModal({ mode }: { mode: "create" | "edit" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createMedicamentoAction, null);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors">
        <Plus size={16} />
        Nuevo Medicamento
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900">Nuevo Medicamento</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"><X size={18} /></button>
            </div>
            <form action={formAction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input name="nombre" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Paracetamol" />
                {state?.errors?.nombre && <p className="text-red-500 text-xs mt-1">{state.errors.nombre[0]}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prescripcion *</label>
                <input name="prescripcion" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="500mg cada 8 horas" />
                {state?.errors?.prescripcion && <p className="text-red-500 text-xs mt-1">{state.errors.prescripcion[0]}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad *</label>
                  <input name="cantidad" type="number" min="1" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="100" />
                  {state?.errors?.cantidad && <p className="text-red-500 text-xs mt-1">{state.errors.cantidad[0]}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unidades *</label>
                  <select name="unidades" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option value="">Seleccione</option>
                    <option value="Tabletas">Tabletas</option>
                    <option value="Cápsulas">Cápsulas</option>
                    <option value="ml">ml</option>
                    <option value="mg">mg</option>
                    <option value="Ampollas">Ampollas</option>
                    <option value="Sobres">Sobres</option>
                  </select>
                  {state?.errors?.unidades && <p className="text-red-500 text-xs mt-1">{state.errors.unidades[0]}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripcion</label>
                <textarea name="descripcion" rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Descripción opcional del medicamento" />
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