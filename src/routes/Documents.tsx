import { Plus, Tags } from 'lucide-react';
import { useState } from 'react';

import DocumentCard from '@/components/Documents/DocumentCard';
import DocumentCreationModal from '@/components/Documents/DocumentCreationModal';
import DocumentModal from '@/components/Documents/DocumentModal';
import DocumentTypesModal from '@/components/Documents/DocumentTypesModal';
import { useDocuments } from '@/hooks/useDocuments'
import type { DocumentRow } from '@/types';

export function Documents() {
    const { data: documentList, isLoading, error } = useDocuments(); // Select from db
    const [selectedDocument, setSelectedDocument] = useState<DocumentRow | null>(null);
    const [isCreating, setIsCreating] = useState(false); // Status for creating a new doc
    const [isManagingTypes, setIsManagingTypes] = useState(false); // Status for managing document types

    return (
        <div className="text-main">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">
                    Documentos
                </h1>
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        className="flex items-center gap-1.5 rounded-lg border border-border-main px-3 py-2 text-sm font-medium hover:bg-surface"
                        onClick={() => setIsManagingTypes(true)}
                    >
                        <Tags size={16} />
                        Tipos de documento
                    </button>
                    <button
                        className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-hover"
                        onClick={() => setIsCreating(true)}
                    >
                        <Plus size={16} />
                        Novo Documento
                    </button>
                </div>
            </div>
            <div>
                {/* Query DB Status */}
                {isLoading && <p className="mt-4 text-main/60">Carregando...</p>}
                {error && <p className="mt-4 text-red-600">Não foi possível carregar os documentos.</p>}

                {/* Document's List */}
                {!isLoading && !error && (
                    documentList?.length === 0 ?
                    <p className="mt-4 text-main/60">Aqui ficarão seus Documentos</p> :
                    <div className="mt-6 flex flex-wrap gap-5">
                        {documentList?.map(document => (
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