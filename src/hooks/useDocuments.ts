import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { DocumentRow } from "@/types";

export const documentsKey = ['documents'] as const;

async function fetchDocuments(): Promise<DocumentRow[]> {
    const { data, error } = await supabase
        .from('documents')
        .select('*');

    if (error) throw error;
    return data;
}

export function useDocuments() {
    return useQuery({
        queryKey: documentsKey,
        queryFn: fetchDocuments,
    });
}

export type DocumentUpdate = Partial<Omit<DocumentRow, 'id' | 'created_at'>> & { id: string };

async function updateDocument({ id, ...changes }: DocumentUpdate): Promise<DocumentRow> {
    const { data, error } = await supabase
        .from('documents')
        .update(changes)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export function useUpdateDocument() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateDocument,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: documentsKey });
        },
    });
}

export type DocumentCreate = Omit<DocumentRow, 'id' | 'created_at'>; // Everything from DocumentRow except id and created_at, 'cause this comes from the DB

async function createDocument(documentRow: DocumentCreate): Promise<DocumentRow> {
    const { data, error } = await supabase
        .from('documents')
        .insert(documentRow)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export function useCreateDocument() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createDocument,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: documentsKey });
        },
    });
}

export type DocumentDelete = Pick<DocumentRow, 'id'>;

async function deleteDocument(documentRow: DocumentDelete): Promise<string> {
    const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentRow.id);

    if (error) throw error;
    return documentRow.id;
}

export function useDeleteDocument() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteDocument,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: documentsKey });
        },
    });
}