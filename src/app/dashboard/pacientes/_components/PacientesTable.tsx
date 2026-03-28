"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { deletePacienteAction } from "@/modules/pacientes/paciente.actions";

interface Paciente {
  pacienteid: number;
  nombre: string;
  apellido: string;
  fechanacimiento: string;
  sexo: string;
  telefono: string;
  correoelectronico: string;
}

export function PacientesTable({ pacientes }: { pacientes: Paciente[] }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: number, nombre: string) {
    if (!confirm(`¿Eliminar al paciente "${nombre}"?`)) return;
    startTransition(async () => {
      const formData = new FormData();
      formData.set("id", String(id));
      const result = await deletePacienteAction(null, formData);
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
            <th className="text-left px-4 py-3 font-semibold text-gray-600">Fecha Nacimiento</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600">Sexo</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600">Telefono</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600">Correo</th>
            <th className="text-right px-4 py-3 font-semibold text-gray-600">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {pacientes.map((p) => (
            <tr key={p.pacienteid} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-medium text-gray-900">{p.nombre} {p.apellido}</td>
              <td className="px-4 py-3 text-gray-600">{p.fechanacimiento}</td>
              <td className="px-4 py-3 text-gray-600">{p.sexo === "M" ? "Masculino" : "Femenino"}</td>
              <td className="px-4 py-3 text-gray-600">{p.telefono}</td>
              <td className="px-4 py-3 text-gray-600">{p.correoelectronico}</td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => handleDelete(p.pacienteid, `${p.nombre} ${p.apellido}`)}
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