"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { deleteMedicamentoAction } from "@/modules/medicamentos/medicamento.actions";

interface Medicamento {
  medicamentoid: number;
  nombre: string;
  prescripcion: string;
  cantidad: number;
  unidades: string;
  descripcion?: string | null;  
}

export function MedicamentosTable({ medicamentos }: { medicamentos: Medicamento[] }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: number, nombre: string) {
    if (!confirm(`¿Eliminar el medicamento "${nombre}"?`)) return;
    startTransition(async () => {
      const formData = new FormData();
      formData.set("id", String(id));
      const result = await deleteMedicamentoAction(null, formData);
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    });
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left px-4 py-3 font-semibold text-gray-600">Nombre</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600">Prescripcion</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600">Cantidad</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600">Unidades</th>
            <th className="text-right px-4 py-3 font-semibold text-gray-600">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {medicamentos.map((m) => (
            <tr key={m.medicamentoid} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-medium text-gray-900">{m.nombre}</td>
              <td className="px-4 py-3 text-gray-600">{m.prescripcion}</td>
              <td className="px-4 py-3 text-gray-600">{m.cantidad}</td>
              <td className="px-4 py-3 text-gray-600">{m.unidades}</td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => handleDelete(m.medicamentoid, m.nombre)}
                  disabled={isPending}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Trash2 size={15} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}