import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";
import type { DocumentType } from "@/types";

export const documentTypesKey = ['document_types'] as const;

async function fetchDocumentTypes(): Promise<DocumentType[]> {
    const { data, error } = await supabase
        .from('document_types')
        .select('*')
        .order('name');

    if (error) throw error;
    return data;
}

export function useDocumentTypes() {
    return useQuery({
        queryKey: documentTypesKey,
        queryFn: fetchDocumentTypes,
    });
}

export type DocumentTypeUpdate = Partial<Omit<DocumentType, 'id' | 'created_at'>> & { id: string };

async function updateDocumentType({ id, ...changes }: DocumentTypeUpdate): Promise<DocumentType> {
    const { data, error } = await supabase
        .from('document_types')
        .update(changes)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export function useUpdateDocumentType() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateDocumentType,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: documentTypesKey });
        },
    });
}

export type DocumentTypeCreate = Omit<DocumentType, 'id' | 'created_at'>;

async function createDocumentType(documentType: DocumentTypeCreate): Promise<DocumentType> {
    const { data, error } = await supabase
        .from('document_types')
        .insert(documentType)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export function useCreateDocumentType() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createDocumentType,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: documentTypesKey });
        },
    });
}

export type DocumentTypeDelete = Pick<DocumentType, 'id'>;

async function deleteDocumentType(documentType: DocumentTypeDelete): Promise<string> {
    const { error } = await supabase
        .from('document_types')
        .delete()
        .eq('id', documentType.id);

    if (error) throw error;
    return documentType.id;
}

export function useDeleteDocumentType() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteDocumentType,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: documentTypesKey });
        },
    });
}
