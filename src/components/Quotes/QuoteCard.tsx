import type { DocumentRow } from '@/types';

interface DocumentRowProps {
    documentRow: DocumentRow;
    onClick?: () => void;
}

export default function DocumentCard({documentRow, onClick}: DocumentRowProps) {
    return (
        <div>
            <p>
                {documentRow.created_at}
            </p>
            <p>
                {documentRow.document_type}
            </p>
            <h1>
                {documentRow.document_name}
            </h1>
        </div>
    )
}