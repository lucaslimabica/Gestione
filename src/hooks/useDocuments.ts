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