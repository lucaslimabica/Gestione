// routes/Vehicles.tsx rendered at /frota, lists the fleet and lets each vehicle be edited in a modal.
import { useState } from "react";
import { Plus } from "lucide-react";
import VehicleCard from "@/components/Vehicles/VehicleCard";
import VehicleModal from "@/components/Vehicles/VehicleModal";
import VehicleCreationModal from "@/components/Vehicles/VehicleCreationModal";
import { useVehicles } from "@/hooks/useVehicles";
import type { Vehicle } from "@/types";

export function Vehicles() {
    const { data: vehiclesList, isLoading, error } = useVehicles();
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    return (
        <div className="text-main">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold tracking-tight">
                    Frota
                </h1>
                <button
                    className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-hover"
                    onClick={() => setIsCreating(true)}
                >
                    <Plus size={16} />
                    Novo Veículo
                </button>
            </div>

            {isLoading && <p className="mt-4 text-main/60">Carregando...</p>}
            {error && <p className="mt-4 text-red-600">Não foi possível carregar os veículos.</p>}

            {!isLoading && !error && (
                vehiclesList?.length === 0 ?
                <p className="mt-4 text-main/60">Aqui ficarão seus veículos</p> :
                <div className="mt-6 flex flex-wrap gap-5">
                    {vehiclesList?.map(vehicle => (
                        <VehicleCard
                            key={vehicle.id}
                            vehicle={vehicle}
                            onClick={() => setSelectedVehicle(vehicle)}
                        />
                    ))}
                </div>
            )}

            {selectedVehicle && (
                <VehicleModal
                    vehicle={selectedVehicle}
                    onClose={() => setSelectedVehicle(null)}
                />
            )}

            {isCreating && (
                            <VehicleCreationModal onClose={() => setIsCreating(false)} />
                        )}
        </div>
    );
}
