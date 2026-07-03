import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { PostIt } from "@/types";

export const postItsKey = ['post_its'] as const;

async function fetchPostIts(): Promise<PostIt[]> {
    const { data, error } = await supabase
        .from('post_its')
        .select('*')
        .eq('done', false)
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
    /**
 * HOW TANSTACK QUERY CACHING WORKS HERE:
 * 
 * 1. 'queryKey' acts as a unique identifier (or shelf label) in the global cache memory.
 * 2. When 'usePostIts' is called, React Query checks if data already exists under this key:
 *    - IF FOUND: It instantly returns the cached data to the UI for a fast user experience.
 *    - IF NOT FOUND (or stale): It automatically triggers the 'queryFn' (fetchPostIts).
 * 3. 'queryFn' fetches the latest data from the Supabase database.
 * 4. Once the database responds, React Query stores the returned array into the cache, 
 *    linking it to the 'postItsKey' label, and serves it to the component.
 * 
 * Note: When mutations succeed, we call 'invalidateQueries' with this same key to 
 * wipe the cached data and force a fresh fetch, keeping the UI perfectly in sync.
 */
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

export type PostItCreate = Omit<PostIt, 'id' | 'created_at'>;

async function createPostIt(postIt: PostItCreate): Promise<PostIt> {
    const { data, error } = await supabase
        .from('post_its')
        .insert(postIt)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export function useCreatePostIt() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createPostIt,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: postItsKey });
        },
    });
}
