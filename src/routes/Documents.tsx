import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';

import DocumentCard from '@/components/Documents/DocumentCard';
import DocumentCreationModal from '@/components/Documents/DocumentCreationModal';
import DocumentModal from '@/components/Documents/DocumentModal';
import DocumentTypesModal from '@/components/Documents/DocumentTypesModal';
import { useDocuments } from '@/hooks/useDocuments'
import type { DocumentRow } from '@/types';

const ALL_FILTER = 'Todos';
const PINNED_TYPE = 'Orçamento';

export function Documents() {
    const { data: documentList, isLoading, error } = useDocuments(); // Select from db
    const [selectedDocument, setSelectedDocument] = useState<DocumentRow | null>(null);
    const [isCreating, setIsCreating] = useState(false); // Status for creating a new doc
    const [isManagingTypes, setIsManagingTypes] = useState(false); // Status for managing document types
    const [typeFilter, setTypeFilter] = useState(ALL_FILTER);

    // Distinct, already-used document types to populate the filter select, with "Orçamentos" pinned first
    const typeOptions = useMemo(() => {
        const values = Array.from(new Set(documentList?.map((document) => document.document_type).filter(Boolean)));
        return values.sort((a, b) => {
            if (a === PINNED_TYPE) return -1;
            if (b === PINNED_TYPE) return 1;
            return a.localeCompare(b);
        });
    }, [documentList]);

    const filteredDocuments = useMemo(() => (
        documentList?.filter((document) => typeFilter === ALL_FILTER || document.document_type === typeFilter)
    ), [documentList, typeFilter]);

    return (
        <div className="text-main">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">
                    Documentos
                </h1>
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-hover"
                        onClick={() => setIsCreating(true)}
                    >
                        <Plus size={16} />
                        Novo Documento
                    </button>
                </div>
            </div>

            {/* Filter */}
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
                <select
                    className="rounded-lg border border-border-main bg-surface px-2 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                >
                    <option value={ALL_FILTER}>Todos os tipos</option>
                    {typeOptions.map((value) => (
                        <option key={value} value={value}>{value}</option>
                    ))}
                </select>
            </div>

            <div>
                {/* Query DB Status */}
                {isLoading && <p className="mt-4 text-main/60">Carregando...</p>}
                {error && <p className="mt-4 text-red-600">Não foi possível carregar os documentos.</p>}

                {/* Document's List */}
                {!isLoading && !error && (
                    documentList?.length === 0 ?
                    <p className="mt-4 text-main/60">Aqui ficarão seus Documentos</p> :
                    filteredDocuments?.length === 0 ?
                    <p className="mt-4 text-main/60">Nenhum documento encontrado</p> :
                    <div className="mt-6 flex flex-wrap gap-5">
                        {filteredDocuments?.map(document => (
                            <DocumentCard
                                key={document.id}
                                documentRow={document}
                                onClick={() => setSelectedDocument(document)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {selectedDocument && (
                <DocumentModal
                    documentRow={selectedDocument}
                    onClose={() => setSelectedDocument(null)}
                />
            )}

            {isCreating && (
                <DocumentCreationModal onClose={() => setIsCreating(false)} />
            )}

            {isManagingTypes && (
                <DocumentTypesModal onClose={() => setIsManagingTypes(false)} />
            )}
        </div>
   )
}