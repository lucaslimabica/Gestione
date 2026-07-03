// routes/Vehicles.tsx rendered at /frota, lists the fleet and lets each vehicle be edited in a modal.
import { useState } from "react";

import VehicleCard from "@/components/Vehicles/VehicleCard";
import VehicleModal from "@/components/Vehicles/VehicleModal";
import { useVehicles } from "@/hooks/useVehicles";
import type { Vehicle } from "@/types";

export function Vehicles() {
    const { data: vehiclesList, isLoading, error } = useVehicles();
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

    return (
        <div className="text-main">
            <h1 className="text-4xl font-bold tracking-tight">
                Frota
            </h1>

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
        </div>
    );
}
