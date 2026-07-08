import { Plus } from 'lucide-react';
import { useState } from 'react';

export function Documents() {
    const [isCreating, setIsCreating] = useState(false);

    return (
        <div className="text-main">
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
        </div>
   ) 
}