import type { Vehicle } from "@/types";

// Interface declaration to be used as a shape
interface VehicleCardProps {
    vehicle: Vehicle;
    onClick?: () => void;
}

type DeadlineStatus = 'overdue' | 'soon' | 'ok';

const STATUS_COLOR: Record<DeadlineStatus, string> = {
    overdue: '#dc2626',
    soon: '#b45309',
    ok: 'var(--color-main)',
};

const getDeadlineStatus = (date: string | null): DeadlineStatus | null => {
    if (!date) return null;
    const diffDays = (new Date(date).getTime() - Date.now()) / 86_400_000;
    if (diffDays < 0) return 'overdue';
    if (diffDays <= 30) return 'soon';
    return 'ok';
};

const formatDate = (date: string | null) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const DEADLINE_FIELDS: { key: keyof Vehicle; label: string }[] = [
    { key: 'inspection_deadline', label: 'Vistoria' },
    { key: 'insurance_deadline', label: 'Seguro' },
    { key: 'tax_deadline', label: 'IUC' },
];

export default function VehicleCard({ vehicle, onClick }: VehicleCardProps) {
    return (
        <div
            role="button"
            tabIndex={0}
            onClick={onClick}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onClick?.();
            }}
            className="flex w-full cursor-pointer flex-col gap-3 rounded-lg border border-border-main bg-surface p-4 text-main shadow-[0_8px_16px_var(--color-theme-shadow)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_12px_24px_var(--color-theme-shadow)] sm:w-72"
        >
            <div className="flex items-start justify-between gap-2">
                <h1 className="font-semibold leading-tight break-words">{vehicle.brand_model}</h1>
                <span className="shrink-0 rounded-full bg-base px-2 py-0.5 font-mono text-xs font-medium whitespace-nowrap">
                    {vehicle.license_plate}
                </span>
            </div>

            <p className="text-sm text-main/70">
                {vehicle.current_driver ? `Motorista: ${vehicle.current_driver}` : 'Sem motorista'}
            </p>

            <div className="grid grid-cols-3 gap-2 border-t border-border-main pt-2 text-xs">
                {DEADLINE_FIELDS.map(({ key, label }) => {
                    const status = getDeadlineStatus(vehicle[key] as string | null);
                    return (
                        <div key={key} className="flex flex-col gap-0.5">
                            <span className="text-main/60">{label}</span>
                            <span
                                className="font-medium"
                                style={{ color: status ? STATUS_COLOR[status] : undefined }}
                            >
                                {formatDate(vehicle[key] as string | null)}
                            </span>
                        </div>
                    );
                })}
            </div>

            {vehicle.observation && (
                <p className="text-sm text-main/70 italic line-clamp-2">{vehicle.observation}</p>
            )}
        </div>
    );
}
