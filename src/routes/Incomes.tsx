// routes/Incomes.tsx renders the "Entradas" page: incoming payments and their dashboard.
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import IncomeCard from "@/components/Incomes/IncomeCard";
import IncomeCreationModal from "@/components/Incomes/IncomeCreationModal";
import IncomeModal from "@/components/Incomes/IncomeModal";
import { useIncomes } from "@/hooks/useIncomes";
import type { Income } from "@/types";

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

export function Incomes() {
    const { data: incomesList, isLoading, error } = useIncomes();
    const [selectedIncome, setSelectedIncome] = useState<Income | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [rangeStart, setRangeStart] = useState(startOfMonth);
    const [rangeEnd, setRangeEnd] = useState(endOfMonth);

    // Nearest upcoming (or overdue) entry still pending
    const nextPayment = useMemo(() => (
        incomesList
            ?.filter((income) => !income.paid)
            .slice()
            .sort((a, b) => a.due_date.localeCompare(b.due_date))[0] ?? null
    ), [incomesList]);

    const inRange = useMemo(() => (
        incomesList?.filter((income) => income.due_date >= rangeStart && income.due_date <= rangeEnd) ?? []
    ), [incomesList, rangeStart, rangeEnd]);

    const receivedInRange = inRange.filter((income) => income.paid).reduce((sum, income) => sum + income.value, 0);
    const pendingInRange = inRange.filter((income) => !income.paid).reduce((sum, income) => sum + income.value, 0);

    return (
        <div className="text-main">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">
                    Entradas
                </h1>
                <button
                    className="flex items-center gap-1.5 self-start rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-hover sm:self-auto"
                    onClick={() => setIsCreating(true)}
                >
                    <Plus size={16} />
                    Nova Entrada
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
                            <p className="mt-1 text-sm text-main/60">Nenhuma entrada pendente</p>
                        )}
                    </div>
                    <div className="rounded-lg bg-base p-3">
                        <p className="text-xs text-main/60">Recebido no período</p>
                        <p className="mt-1 text-lg font-semibold" style={{ color: '#15803d' }}>
                            {formatCurrency(receivedInRange)}
                        </p>
                    </div>
                    <div className="rounded-lg bg-base p-3">
                        <p className="text-xs text-main/60">Pendente no período</p>
                        <p className="mt-1 text-lg font-semibold" style={{ color: '#ff0000' }}>
                            {formatCurrency(pendingInRange)}
                        </p>
                    </div>
                </div>
            </div>

            <div>
                {/* Query DB Status */}
                {isLoading && <p className="mt-4 text-main/60">Carregando...</p>}
                {error && <p className="mt-4 text-red-600">Não foi possível carregar as entradas.</p>}

                {/* Income's List */}
                {!isLoading && !error && (
                    incomesList?.length === 0 ?
                    <p className="mt-4 text-main/60">Aqui ficarão suas Entradas</p> :
                    <div className="mt-6 flex flex-wrap gap-5">
                        {incomesList?.map(income => (
                            <IncomeCard
                                key={income.id}
                                income={income}
                                onClick={() => setSelectedIncome(income)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {selectedIncome && (
                <IncomeModal
                    income={selectedIncome}
                    onClose={() => setSelectedIncome(null)}
                />
            )}

            {isCreating && (
                <IncomeCreationModal onClose={() => setIsCreating(false)} />
            )}
        </div>
    )
}
