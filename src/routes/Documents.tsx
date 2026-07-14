import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useDocuments } from '@/hooks/useDocuments'
import type { DocumentRow } from '@/types';
import QuoteCard from '@/components/Quotes/QuoteCard';

export function Documents() {
    const { data: documentList, isLoading, error } = useDocuments(); // Select from db
    const [selectedDocument, setSelectedDocument] = useState<DocumentRow | null>(null);
    const [isCreating, setIsCreating] = useState(false); // Status for creating a new doc

    return (
        <div className="text-main">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold tracking-tight">
                    Documentos
                </h1>
                <button
                    className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-hover"
                    onClick={() => setIsCreating(true)}
                >
                    <Plus size={16} />
                    Novo Documento
                </button>
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
                            <QuoteCard
                                key={document.id}
                                documentRow={document}
                                onClick={() => setSelectedDocument(document)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
   ) 
}