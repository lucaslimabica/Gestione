import type { PostIt } from "@/types";

// Interface declaration to be used as a shape
interface PostItCardProps {
    postIt: PostIt;
    onClick?: () => void;
}

type PriorityInfo = {
    label: string;
    color: string;
};

const PRIORITY_INFO: Record<number, PriorityInfo> = {
    3: { label: 'Alta', color: '#dc2626' },
    2: { label: 'Média', color: '#b45309' },
    1: { label: 'Baixa', color: '#15803d' },
};

const getPriorityInfo = (prio: number): PriorityInfo => PRIORITY_INFO[prio] ?? PRIORITY_INFO[1];

const formatDate = (date: string | null) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
};

export default function PostItCard({ postIt, onClick }: PostItCardProps) {
    const priority = getPriorityInfo(postIt.priority);
    const deadline = formatDate(postIt.deadline);
    const startDate = formatDate(postIt.start_date);
    const bgColor = (postIt.done === false ? postIt.color : '#B3B2AD');

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={onClick}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onClick?.();
            }}
            className="flex w-full cursor-pointer flex-col gap-3 rounded-lg p-4 text-slate-900 shadow-[0_8px_16px_var(--color-theme-shadow)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_12px_24px_var(--color-theme-shadow)] sm:w-64"
            style={{ backgroundColor: bgColor || '#FEF08A' }}
        >
            <div className="flex items-start justify-between gap-2">
                <h1 className="font-semibold leading-tight break-words">{postIt.title}</h1>
                <span
                    className="shrink-0 rounded-full bg-white/60 px-2 py-0.5 text-xs font-medium whitespace-nowrap"
                    style={{ color: priority.color }}
                >
                    {priority.label}
                </span>
            </div>

            {postIt.content && (
                <p className="text-sm text-slate-800/90 line-clamp-4">{postIt.content}</p>
            )}

            {(startDate || deadline) && (
                <div className="mt-auto flex items-center justify-between text-xs text-slate-700/80 border-t border-black/10 pt-2">
                    {startDate && <span>Início: {startDate}</span>}
                    {deadline && <span className="font-semibold text-red-700">Prazo: {deadline}</span>}
                </div>
            )}
        </div>
    );
}
