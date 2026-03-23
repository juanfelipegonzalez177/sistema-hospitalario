import { MedicoRepository } from "@/modules/medicos/medico.repository";
import { Plus } from "lucide-react";

export const metadata = { title: "Medicos" };

export default async function MedicosPage() {
  const repo = new MedicoRepository();
  const medicos = await repo.findAll();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medicos</h1>
          <p className="text-sm text-gray-500 mt-1">
            {medicos.length} medico{medicos.length !== 1 ? "s" : ""} registrados
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-green-600
          hover:bg-green-700 text-white text-sm font-medium rounded-lg">
          <Plus size={16} />
          Nuevo Medico
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Nombre</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Especialidad</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Hospital</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Telefono</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Correo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {medicos.map((m) => (
              <tr key={m.medicoId} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">
                  Dr. {m.nombre} {m.apellido}
                </td>
                <td className="px-4 py-3 text-gray-600">{m.especialidad.nombre}</td>
                <td className="px-4 py-3 text-gray-600">{m.hospital.nombre}</td>
                <td className="px-4 py-3 text-gray-600">{m.telefono}</td>
                <td className="px-4 py-3 text-gray-600">{m.correoElectronico}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}