"use client";

import { useTransition } from "react";
import { deleteHospitalAction } from "@/modules/hospitales/hospital.actions";
import type { Hospital } from "@/modules/hospitales/types";
import { Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  hospitales: Hospital[];
}

export function HospitalesTable({ hospitales }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: number, nombre: string) {
    if (!confirm(`¿Eliminar el hospital "${nombre}"?`)) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.set("id", String(id));

      const result = await deleteHospitalAction(null, formData);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left px-4 py-3 font-semibold text-gray-600">Nombre</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600">Direccion</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600">NIT</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600">Telefono</th>
            <th className="text-right px-4 py-3 font-semibold text-gray-600">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {hospitales.map((hospital) => (
            <tr key={hospital.hospitalId} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-medium text-gray-900">{hospital.nombre}</td>
              <td className="px-4 py-3 text-gray-600">{hospital.direccion}</td>
              <td className="px-4 py-3 text-gray-600">{hospital.nit}</td>
              <td className="px-4 py-3 text-gray-600">{hospital.telefono}</td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <button
                    className="p-1.5 text-gray-400 hover:text-blue-600
                      hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(hospital.hospitalId, hospital.nombre)}
                    disabled={isPending}
                    className="p-1.5 text-gray-400 hover:text-red-600
                      hover:bg-red-50 rounded-lg transition-colors
                      disabled:opacity-50"
                    title="Eliminar"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}