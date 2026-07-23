// The modal/pop-up to be shown as you click on the document card

import { X, Trash2, Download, FileDown } from "lucide-react";
import { useEffect, useState } from "react";

import { useUpdateDocument, useDeleteDocument } from "@/hooks/useDocuments";
import { useDocumentTypes } from "@/hooks/useDocumentTypes";
import { generateBudgetPdf } from "@/lib/pdf";
import type { DocumentRow } from "@/types";

interface DocumentModalProps {
    documentRow: DocumentRow;
    onClose: () => void;
}

// Returns the date as formated string
const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export default function DocumentModal({ documentRow, onClose }: DocumentModalProps) {
    const [documentName, setDocumentName] = useState(documentRow.document_name);
    const [documentType, setDocumentType] = useState(documentRow.document_type);
    const [fileUrl, setFileUrl] = useState(documentRow.file_url ?? '');
    const [observation, setObservation] = useState(documentRow.observation ?? '');

    // Budget content fields, only relevant when the document is a Gestione-generated orçamento
    const [idComercial, setIdComercial] = useState(documentRow.content?.id_comercial ?? '');
    const [description, setDescription] = useState(documentRow.content?.description ?? '');
    const [paymentTerms, setPaymentTerms] = useState(documentRow.content?.payment_terms ?? '');
    const [items, setItems] = useState(
        documentRow.content?.items.map((item) => ({ description: item.description, value: String(item.value) }))
            ?? [{ description: '', value: '' }],
    );

    // Show delete confirmation buttons
    const [isConfirmationButtonVisible, setIsConfirmationButtonVisible] = useState(false);

    const { mutate, isPending, error } = useUpdateDocument();
    const { mutate: deleteDocument, isPending: isDeleting } = useDeleteDocument();
    const { data: documentTypes } = useDocumentTypes();
    const isBudget = documentTypes?.find((type) => type.name === documentType)?.is_budget ?? false;

    useEffect(() => { // This block is for the closer as 'Esc' is pressed
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [onClose]);

    const totalValue = items.reduce((sum, item) => sum + (Number(item.value) || 0), 0);

    const updateItem = (index: number, field: 'description' | 'value', value: string) => {
        setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
    };

    const addItem = () => setItems((prev) => [...prev, { description: '', value: '' }]);
    const removeItem = (index: number) => setItems((prev) => prev.filter((_, i) => i !== index));

    const handleSave = () => {
        mutate( // This is the updated function
            {
                id: documentRow.id,
                document_name: documentName,
                document_type: documentType,
                file_url: isBudget ? null : (fileUrl || null),
                observation: observation || null,
                content: isBudget
                    ? {
                        id_comercial: idComercial,
                        description,
                        items: items
                            .filter((item) => item.description.trim())
                            .map((item) => ({ description: item.description, value: Number(item.value) || 0 })),
                        total_value: totalValue,
                        payment_terms: paymentTerms,
                    }
                    : null,
            },
            { onSuccess: onClose },
        );
    };

    const handleDownloadPdf = () => {
        generateBudgetPdf({
            documentName,
            createdAt: documentRow.created_at,
            content: {
                id_comercial: idComercial,
                description,
                items: items
                    .filter((item) => item.description.trim())
                    .map((item) => ({ description: item.description, value: Number(item.value) || 0 })),
                total_value: totalValue,
                payment_terms: paymentTerms,
            },
        });
    };

    // The forms
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
        >
            <div
                className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl border border-border-main bg-surface p-5 text-main shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-2">
                    <input
                        className="w-full rounded bg-base px-2 py-1 text-lg font-semibold outline-none focus:ring-2 focus:ring-primary"
                        value={documentName}
                        onChange={(e) => setDocumentName(e.target.value)}
                        placeholder="Nome do documento"
                    />
                    <button
                        className="shrink-0 rounded-full p-1 hover:bg-base"
                        onClick={onClose}
                        aria-label="Fechar"
                    >
                        <X size={18} />
                    </button>
                </div>

                <p className="mt-1 text-xs text-main/60">Criado em {formatDate(documentRow.created_at)}</p>

                <div className="mt-3 grid grid-cols-2 gap-3">
                    <label className="text-xs font-medium text-main/70">
                        Tipo
                        <select
                            className="mt-1 w-full rounded bg-base px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                            value={documentType}
                            onChange={(e) => setDocumentType(e.target.value)}
                        >
                            {documentTypes && !documentTypes.some((type) => type.name === documentType) && (
                                <option value={documentType}>{documentType}</option>
                            )}
                            {documentTypes?.map((type) => (
                                <option key={type.id} value={type.name}>{type.name}</option>
                            ))}
                        </select>
                    </label>
                    {!isBudget && (
                        <label className="text-xs font-medium text-main/70">
                            Link do arquivo
                            <div className="mt-1 flex items-center gap-1">
                                <input
                                    className="min-w-0 flex-1 rounded bg-base px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                                    value={fileUrl}
                                    onChange={(e) => setFileUrl(e.target.value)}
                                    placeholder="https://..."
                                />
                                {fileUrl && (
                                    <a
                                        href={fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        download
                                        className="shrink-0 rounded p-1.5 hover:bg-base"
                                        aria-label="Baixar arquivo"
                                    >
                                        <Download size={16} />
                                    </a>
                                )}
                            </div>
                        </label>
                    )}
                </div>

                <textarea
                    className="mt-3 w-full resize-none rounded bg-base px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                    rows={4}
                    value={observation}
                    onChange={(e) => setObservation(e.target.value)}
                    placeholder="Observação"
                />

                {isBudget && (
                    <div className="mt-3 flex flex-col gap-3 border-t border-border-main pt-3">
                        <div className="grid grid-cols-2 gap-3">
                            <label className="text-xs font-medium text-main/70">
                                Nº comercial
                                <input
                                    className="mt-1 w-full rounded bg-base px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                                    value={idComercial}
                                    onChange={(e) => setIdComercial(e.target.value)}
                                    placeholder="Ex: 65/2026"
                                />
                            </label>
                            <label className="text-xs font-medium text-main/70">
                                Condições de pagamento
                                <textarea
                                    className="mt-1 w-full resize-none rounded bg-base px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                                    rows={3}
                                    value={paymentTerms}
                                    onChange={(e) => setPaymentTerms(e.target.value)}
                                />
                            </label>
                        </div>

                        <textarea
                            className="w-full resize-none rounded bg-base px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Descrição do orçamento"
                        />

                        <div className="flex flex-col gap-2">
                            <span className="text-xs font-medium text-main/70">Itens</span>
                            {items.map((item, index) => (
                                <div key={index} className="flex items-start gap-2">
                                    <textarea
                                        className="min-w-0 flex-1 resize-none rounded bg-base px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                                        rows={2}
                                        value={item.description}
                                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                                        placeholder="Descrição"
                                    />
                                    <input
                                        type="number"
                                        className="w-20 shrink-0 rounded bg-base px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary sm:w-28"
                                        value={item.value}
                                        onChange={(e) => updateItem(index, 'value', e.target.value)}
                                        placeholder="Valor"
                                    />
                                    <button
                                        className="shrink-0 rounded p-1 text-main/60 hover:bg-base"
                                        onClick={() => removeItem(index)}
                                        aria-label="Remover item"
                                        disabled={items.length === 1}
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                            <button
                                className="self-start rounded px-2 py-1 text-xs font-medium text-primary hover:bg-base"
                                onClick={addItem}
                            >
                                + Adicionar item
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <button
                                className="inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium text-primary hover:bg-base"
                                onClick={handleDownloadPdf}
                            >
                                <FileDown size={14} />
                                Baixar PDF
                            </button>
                            <p className="text-sm font-medium">
                                Total: {totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </p>
                        </div>
                    </div>
                )}

                <div className="mt-3 flex items-center justify-between border-t border-border-main pt-3">
                    <button
                        onClick={() => setIsConfirmationButtonVisible(true)}
                        className="rounded bg-red-500 hover:bg-red-800 text-white p-2 text-sm font-small font-bold inline-flex items-center gap-x-1.5"
                    >
                        <Trash2 />
                        <span>Excluir</span>
                    </button>
                    <div className="inline-flex">
                        <button
                            onClick={() => deleteDocument({ id: documentRow.id }, { onSuccess: onClose })}
                            disabled={isDeleting}
                            className={`bg-gray-300 hover:bg-gray-400 text-gray-800 text-xs font-bold py-2 px-4 rounded-l transition-all duration-300 ${isConfirmationButtonVisible ? "block opacity-100" : "hidden opacity-0"}`}
                        >
                            <span>Sim</span>
                        </button>
                        <button
                            onClick={() => setIsConfirmationButtonVisible(false)}
                            className={`bg-gray-300 hover:bg-gray-400 text-gray-800 text-xs font-bold py-2 px-4 rounded-r transition-all duration-300 ${isConfirmationButtonVisible ? "block opacity-100" : "hidden opacity-0"}`}
                        >
                            <span>Não</span>
                        </button>
                    </div>
                </div>

                {error && (
                    <p className="mt-3 text-xs font-medium text-red-600">
                        Não foi possível salvar. Tente novamente.
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
                        disabled={isPending || !documentName.trim()}
                    >
                        {isPending ? 'Salvando...' : 'Salvar'}
                    </button>
                </div>
            </div>
        </div>
    );
}
