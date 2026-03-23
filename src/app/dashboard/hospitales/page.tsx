import { HospitalRepository } from "@/modules/hospitales/hospital.repository";
import { HospitalService }    from "@/modules/hospitales/hospital.service";
import { HospitalesTable }    from "./_components/HospitalesTable";
import { HospitalFormModal }  from "./_components/HospitalFormModal";

export const metadata = { title: "Hospitales" };

const hospitalService = new HospitalService(new HospitalRepository());

export default async function HospitalesPage() {
  const result = await hospitalService.getAll();

  if (!result.success) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-6">
        <h2 className="text-red-700 font-semibold">Error al cargar hospitales</h2>
        <p className="text-red-600 text-sm mt-1">{result.error}</p>
      </div>
    );
  }

  const hospitales = result.data || [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hospitales</h1>
          <p className="text-sm text-gray-500 mt-1">
            {hospitales.length} hospital{hospitales.length !== 1 ? "es" : ""} registrados
          </p>
        </div>
        <HospitalFormModal mode="create" />
      </div>

      {hospitales.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No hay hospitales registrados</p>
          <p className="text-sm mt-1">Haz clic en "Nuevo Hospital" para agregar uno.</p>
        </div>
      ) : (
        <HospitalesTable hospitales={hospitales} />
      )}
    </div>
  );
}