// The Card to be shown in the documents page

import type { DocumentRow } from "@/types";

// Interface declaration to be used as a shape
interface DocumentCardProps {
    documentRow: DocumentRow;
    onClick?: () => void;
}

// Returns the date as formated string
const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export default function DocumentCard({ documentRow, onClick }: DocumentCardProps) {
    const source = documentRow.content
        ? 'Gerado no Gestione'
        : documentRow.file_url
        ? 'Arquivo anexado'
        : 'Sem arquivo';

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
                <h1 className="font-semibold leading-tight break-words">{documentRow.document_name}</h1>
                <span className="shrink-0 rounded-full bg-base px-2 py-0.5 font-mono text-xs font-medium whitespace-nowrap">
                    {documentRow.document_type}
                </span>
            </div>

            <p className="text-sm text-main/70">
                Criado em {formatDate(documentRow.created_at)}
            </p>

            <p className="border-t border-border-main pt-2 text-xs text-main/60">
                {source}
                {documentRow.content && ` · Nº ${documentRow.content.id_comercial}`}
            </p>

            {documentRow.observation && (
                <p className="text-sm text-main/70 italic line-clamp-2">{documentRow.observation}</p>
            )}
        </div>
    );
}
