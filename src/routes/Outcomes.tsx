// routes/Outcomes.tsx renders the "Saídas" page: outgoing payments and their dashboard.
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import OutcomeCard from "@/components/Outcomes/OutcomeCard";
import OutcomeCreationModal from "@/components/Outcomes/OutcomeCreationModal";
import OutcomeModal from "@/components/Outcomes/OutcomeModal";
import { useOutcomes } from "@/hooks/useOutcomes";
import type { Outcome } from "@/types";

const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'EUR' });
};

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

// Builds a "YYYY-MM-DD" string from local date parts, avoiding UTC-shift bugs from toISOString()
const toISODate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const startOfMonth = () => {
    const now = new Date();
    return toISODate(new Date(now.getFullYear(), now.getMonth(), 1));
};

const endOfMonth = () => {
    const now = new Date();
    return toISODate(new Date(now.getFullYear(), now.getMonth() + 1, 0));
};

export function Outcomes() {
    const { data: outcomesList, isLoading, error } = useOutcomes();
    const [selectedOutcome, setSelectedOutcome] = useState<Outcome | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [rangeStart, setRangeStart] = useState(startOfMonth);
    const [rangeEnd, setRangeEnd] = useState(endOfMonth);

    // Nearest upcoming (or overdue) entry still pending
    const nextPayment = useMemo(() => (
        outcomesList
            ?.filter((outcome) => !outcome.paid)
            .slice()
            .sort((a, b) => a.due_date.localeCompare(b.due_date))[0] ?? null
    ), [outcomesList]);

    const inRange = useMemo(() => (
        outcomesList?.filter((outcome) => outcome.due_date >= rangeStart && outcome.due_date <= rangeEnd) ?? []
    ), [outcomesList, rangeStart, rangeEnd]);

    const paidInRange = inRange.filter((outcome) => outcome.paid).reduce((sum, outcome) => sum + outcome.value, 0);
    const pendingInRange = inRange.filter((outcome) => !outcome.paid).reduce((sum, outcome) => sum + outcome.value, 0);

    return (
        <div className="text-main">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">
                    Saídas
                </h1>
                <button
                    className="flex items-center gap-1.5 self-start rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-hover sm:self-auto"
                    onClick={() => setIsCreating(true)}
                >
                    <Plus size={16} />
                    Nova Saída
                </button>
            </div>

            {/* Dashboard */}
            <div className="mt-4 rounded-lg border border-border-main bg-surface p-4">
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-main/70">
                    <span>Período:</span>
                    <input
                        type="date"
                        className="rounded border border-border-main bg-base px-2 py-1 text-sm text-main outline-none focus:ring-2 focus:ring-primary"
                        value={rangeStart}
                        onChange={(e) => setRangeStart(e.target.value)}
                    />
                    <span>até</span>
                    <input
                        type="date"
                        className="rounded border border-border-main bg-base px-2 py-1 text-sm text-main outline-none focus:ring-2 focus:ring-primary"
                        value={rangeEnd}
                        onChange={(e) => setRangeEnd(e.target.value)}
                    />
                </div>

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-lg bg-base p-3">
                        <p className="text-xs text-main/60">Próximo pagamento</p>
                        {nextPayment ? (
                            <>
                                <p className="mt-1 font-semibold break-words">{nextPayment.description}</p>
                                <p className="text-sm text-main/70">
                                    {formatDate(nextPayment.due_date)} · {formatCurrency(nextPayment.value)}
                                </p>
                            </>
                        ) : (
                            <p className="mt-1 text-sm text-main/60">Nenhuma saída pendente</p>
                        )}
                    </div>
                    <div className="rounded-lg bg-base p-3">
                        <p className="text-xs text-main/60">Pago no período</p>
                        <p className="mt-1 text-lg font-semibold" style={{ color: '#dce929' }}>
                            {formatCurrency(paidInRange)}
                        </p>
                    </div>
                    <div className="rounded-lg bg-base p-3">
                        <p className="text-xs text-main/60">Pendente no período</p>
                        <p className="mt-1 text-lg font-semibold" style={{ color: '#ff0404' }}>
                            {formatCurrency(pendingInRange)}
                        </p>
                    </div>
                </div>
            </div>

            <div>
                {/* Query DB Status */}
                {isLoading && <p className="mt-4 text-main/60">Carregando...</p>}
                {error && <p className="mt-4 text-red-600">Não foi possível carregar as saídas.</p>}

                {/* Outcome's List */}
                {!isLoading && !error && (
                    outcomesList?.length === 0 ?
                    <p className="mt-4 text-main/60">Aqui ficarão suas Saídas</p> :
                    <div className="mt-6 flex flex-wrap gap-5">
                        {outcomesList?.map(outcome => (
                            <OutcomeCard
                                key={outcome.id}
                                outcome={outcome}
                                onClick={() => setSelectedOutcome(outcome)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {selectedOutcome && (
                <OutcomeModal
                    outcome={selectedOutcome}
                    onClose={() => setSelectedOutcome(null)}
                />
            )}

            {isCreating && (
                <OutcomeCreationModal onClose={() => setIsCreating(false)} />
            )}
        </div>
    )
}
