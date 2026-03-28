"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { deleteMedicoAction } from "@/modules/medicos/medico.actions";
import type { MedicoConRelaciones } from "@/modules/medicos/types";

export function MedicosTable({ medicos }: { medicos: MedicoConRelaciones[] }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: number, nombre: string) {
    if (!confirm(`¿Eliminar al médico "${nombre}"?`)) return;
    startTransition(async () => {
      const formData = new FormData();
      formData.set("id", String(id));
      const result = await deleteMedicoAction(null, formData);
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
            <th className="text-left px-4 py-3 font-semibold text-gray-600">Especialidad</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600">Hospital</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600">Telefono</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600">Correo</th>
            <th className="text-right px-4 py-3 font-semibold text-gray-600">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {medicos.map((m) => (
            <tr key={m.medicoId} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-medium text-gray-900">Dr. {m.nombre} {m.apellido}</td>
              <td className="px-4 py-3 text-gray-600">{m.especialidad.nombre}</td>
              <td className="px-4 py-3 text-gray-600">{m.hospital.nombre}</td>
              <td className="px-4 py-3 text-gray-600">{m.telefono}</td>
              <td className="px-4 py-3 text-gray-600">{m.correoElectronico}</td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => handleDelete(m.medicoId, `${m.nombre} ${m.apellido}`)}
                  disabled={isPending}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Eliminar"
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