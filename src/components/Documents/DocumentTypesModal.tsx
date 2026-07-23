// The modal/pop-up to manage the available document types

import { X, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import {
    useDocumentTypes,
    useCreateDocumentType,
    useUpdateDocumentType,
    useDeleteDocumentType,
} from "@/hooks/useDocumentTypes";
import type { DocumentType } from "@/types";

interface DocumentTypesModalProps {
    onClose: () => void;
}

function DocumentTypeRow({ documentType }: { documentType: DocumentType }) {
    const [name, setName] = useState(documentType.name);
    const [isBudget, setIsBudget] = useState(documentType.is_budget);

    const { mutate: update, isPending: isSaving } = useUpdateDocumentType();
    const { mutate: remove, isPending: isDeleting } = useDeleteDocumentType();

    const isDirty = name !== documentType.name || isBudget !== documentType.is_budget;

    return (
        <div className="flex items-center gap-2">
            <input
                className="w-full rounded bg-base px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <label className="flex shrink-0 items-center gap-1 text-xs text-main/70">
                <input
                    type="checkbox"
                    checked={isBudget}
                    onChange={(e) => setIsBudget(e.target.checked)}
                />
                Gerado no Gestione
            </label>
            <button
                className="shrink-0 rounded px-2 py-1 text-xs font-medium text-primary hover:bg-base disabled:opacity-40"
                onClick={() => update({ id: documentType.id, name, is_budget: isBudget })}
                disabled={!isDirty || isSaving}
            >
                Salvar
            </button>
            <button
                className="shrink-0 rounded p-1 text-red-500 hover:bg-base disabled:opacity-40"
                onClick={() => remove({ id: documentType.id })}
                disabled={isDeleting}
                aria-label="Remover tipo"
            >
                <Trash2 size={14} />
            </button>
        </div>
    );
}

export default function DocumentTypesModal({ onClose }: DocumentTypesModalProps) {
    const { data: typesList, isLoading, error: loadError } = useDocumentTypes();

    const [newName, setNewName] = useState('');
    const [newIsBudget, setNewIsBudget] = useState(false);
    const { mutate: create, isPending, error } = useCreateDocumentType();

    useEffect(() => { // This block is for the closer as 'Esc' is pressed
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [onClose]);

    const handleCreate = () => {
        create(
            { name: newName, is_budget: newIsBudget },
            { onSuccess: () => { setNewName(''); setNewIsBudget(false); } },
        );
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
        >
            <div
                className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl border border-border-main bg-surface p-5 text-main shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between gap-2">
                    <h2 className="text-lg font-semibold">Tipos de documento</h2>
                    <button
                        className="shrink-0 rounded-full p-1 hover:bg-base"
                        onClick={onClose}
                        aria-label="Fechar"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="mt-3 flex flex-col gap-2">
                    {isLoading && <p className="text-sm text-main/60">Carregando...</p>}
                    {loadError && <p className="text-sm text-red-600">Não foi possível carregar os tipos.</p>}
                    {typesList?.length === 0 && (
                        <p className="text-sm text-main/60">Nenhum tipo cadastrado ainda.</p>
                    )}
                    {typesList?.map((documentType) => (
                        <DocumentTypeRow key={documentType.id} documentType={documentType} />
                    ))}
                </div>

                <div className="mt-4 flex items-center gap-2 border-t border-border-main pt-3">
                    <input
                        className="w-full rounded bg-base px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Novo tipo (ex: Seguro)"
                    />
                    <label className="flex shrink-0 items-center gap-1 text-xs text-main/70">
                        <input
                            type="checkbox"
                            checked={newIsBudget}
                            onChange={(e) => setNewIsBudget(e.target.checked)}
                        />
                        Gerado no Gestione
                    </label>
                    <button
                        className="shrink-0 rounded bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-60"
                        onClick={handleCreate}
                        disabled={isPending || !newName.trim()}
                    >
                        + Adicionar
                    </button>
                </div>

                {error && (
                    <p className="mt-3 text-xs font-medium text-red-600">
                        Não foi possível adicionar. Tente novamente.
                    </p>
                )}
            </div>
        </div>
    );
}
