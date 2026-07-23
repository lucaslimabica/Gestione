// The Card to be shown in the incomes page

import type { Income } from "@/types";

// Interface declaration to be used as a shape
interface IncomeCardProps {
    income: Income;
    onClick?: () => void;
}

// Typing the deadline options as string
type DeadlineStatus = 'overdue' | 'soon' | 'ok';

// This const storages the color to be used ahead
const STATUS_COLOR: Record<DeadlineStatus, string> = {
    overdue: '#dc2626',
    soon: '#b45309',
    ok: 'var(--color-main)',
};

// Calculates the deadline based on today and return a DeadlineStatus string (one of three)
const getDeadlineStatus = (date: string): DeadlineStatus => {
    const diffDays = (new Date(date).getTime() - Date.now()) / 86_400_000;
    if (diffDays < 0) return 'overdue';
    if (diffDays <= 7) return 'soon';
    return 'ok';
};

// Returns the date as formated string
const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'EUR' });
};

export default function IncomeCard({ income, onClick }: IncomeCardProps) {
    const status = getDeadlineStatus(income.due_date);

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
                <h1 className="font-semibold leading-tight break-words">{income.description}</h1>
                <span
                    className="shrink-0 rounded-full bg-base px-2 py-0.5 text-xs font-medium whitespace-nowrap"
                    style={{ color: income.paid ? '#15803d' : STATUS_COLOR[status] }}
                >
                    {income.paid ? 'Recebido' : 'Pendente'}
                </span>
            </div>

            <p className="text-lg font-semibold text-primary">{formatCurrency(income.value)}</p>

            <p className="border-t border-border-main pt-2 text-xs text-main/60">
                Vencimento:{' '}
                <span style={{ color: income.paid ? undefined : STATUS_COLOR[status] }}>
                    {formatDate(income.due_date)}
                </span>
            </p>

            {income.observation && (
                <p className="text-sm text-main/70 italic line-clamp-2">{income.observation}</p>
            )}
        </div>
    );
}
