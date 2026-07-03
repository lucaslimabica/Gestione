import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";
import type { PostIt } from "@/types";

export const postItsKey = ['post_its'] as const;

async function fetchPostIts(): Promise<PostIt[]> {
    const { data, error } = await supabase
        .from('post_its')
        .select('*')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
}

export function usePostIts() {
    return useQuery({
        queryKey: postItsKey,
        queryFn: fetchPostIts,
    });
}

export type PostItUpdate = Partial<Omit<PostIt, 'id' | 'created_at'>> & { id: string };

async function updatePostIt({ id, ...changes }: PostItUpdate): Promise<PostIt> {
    const { data, error } = await supabase
        .from('post_its')
        .update(changes)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export function useUpdatePostIt() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updatePostIt,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: postItsKey });
        },
    });
}
