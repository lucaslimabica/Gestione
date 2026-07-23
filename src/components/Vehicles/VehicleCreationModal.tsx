// The modal/pop-up to be shown as you click on the vehicles card

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCreateVehicle } from "@/hooks/useVehicles";

interface VehicleModalProps {
    onClose: () => void;
}

export default function VehicleCreationModal({ onClose }: VehicleModalProps) {
    const [brandModel, setBrandModel] = useState('');
    const [licensePlate, setLicensePlate] = useState('');
    const [currentDriver, setCurrentDriver] = useState('');
    const [inspectionDeadline, setInspectionDeadline] = useState('');
    const [insuranceDeadline, setInsuranceDeadline] = useState('');
    const [taxDeadline, setTaxDeadline] = useState('');
    const [observation, setObservation] = useState('');

    const { mutate, isPending, error } = useCreateVehicle();

    useEffect(() => { // This block is for the closer as 'Esc' is pressed
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [onClose]);

    const handleSave = () => {
        mutate( // This is the updated function
            {
                brand_model: brandModel,
                license_plate: licensePlate,
                current_driver: currentDriver || null,
                inspection_deadline: inspectionDeadline || null,
                insurance_deadline: insuranceDeadline || null,
                tax_deadline: taxDeadline || null,
                observation: observation || null,
            },
            { onSuccess: onClose },
        );
    };

    // The forms
    return ( 
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md rounded-xl border border-border-main bg-surface p-5 text-main shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-2">
                    <input
                        className="w-full rounded bg-base px-2 py-1 text-lg font-semibold outline-none focus:ring-2 focus:ring-primary"
                        value={brandModel}
                        onChange={(e) => setBrandModel(e.target.value)}
                        placeholder="Modelo"
                    />
                    <button
                        className="shrink-0 rounded-full p-1 hover:bg-base"
                        onClick={onClose}
                        aria-label="Fechar"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                    <label className="text-xs font-medium text-main/70">
                        Placa
                        <input
                            className="mt-1 w-full rounded bg-base px-2 py-1.5 font-mono text-sm outline-none focus:ring-2 focus:ring-primary"
                            value={licensePlate}
                            onChange={(e) => setLicensePlate(e.target.value)}
                        />
                    </label>
                    <label className="text-xs font-medium text-main/70">
                        Motorista atual
                        <input
                            className="mt-1 w-full rounded bg-base px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                            value={currentDriver}
                            onChange={(e) => setCurrentDriver(e.target.value)}
                        />
                    </label>
                </div>

                <textarea
                    className="mt-3 w-full resize-none rounded bg-base px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                    value={observation}
                    onChange={(e) => setObservation(e.target.value)}
                    placeholder="Observação"
                />

                <div className="mt-3 grid grid-cols-3 gap-3">
                    <label className="text-xs font-medium text-main/70">
                        Vistoria
                        <input
                            type="date"
                            className="mt-1 w-full rounded bg-base px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                            value={inspectionDeadline}
                            onChange={(e) => setInspectionDeadline(e.target.value)}
                        />
                    </label>
                    <label className="text-xs font-medium text-main/70">
                        Seguro
                        <input
                            type="date"
                            className="mt-1 w-full rounded bg-base px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                            value={insuranceDeadline}
                            onChange={(e) => setInsuranceDeadline(e.target.value)}
                        />
                    </label>
                    <label className="text-xs font-medium text-main/70">
                        IUC
                        <input
                            type="date"
                            className="mt-1 w-full rounded bg-base px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                            value={taxDeadline}
                            onChange={(e) => setTaxDeadline(e.target.value)}
                        />
                    </label>
                </div>

                {error && (
                    <p className="mt-3 text-xs font-medium text-red-600">
                        Não foi possível criar. Tente novamente.
                    </p>
                )}

                <div className="mt-4 flex justify-end gap-2">
                    <button
                        className="rounded px-3 py-1.5 text-sm font-medium hover:bg-base"
                        onClick={onClose}
                        disabled={isPending}
                    >
                        Cancelar
                    </button>
                    <button
                        className="rounded bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-60"
                        onClick={handleSave}
                        disabled={isPending || !brandModel.trim() || !licensePlate.trim()}
                    >
                        {isPending ? 'Criando...' : 'Criar'}
                    </button>
                </div>
            </div>
        </div>
    );
}
