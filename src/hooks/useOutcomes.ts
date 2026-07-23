import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Outcome } from "@/types";

export const outcomesKey = ['outcomes'] as const;

async function fetchOutcomes(): Promise<Outcome[]> {
    const { data, error } = await supabase
        .from('outcomes')
        .select('*')
        .order('due_date', { ascending: true });

    if (error) throw error;
    return data;
}

export function useOutcomes() {
    return useQuery({
        queryKey: outcomesKey,
        queryFn: fetchOutcomes,
    });
}

export type OutcomeUpdate = Partial<Omit<Outcome, 'id' | 'created_at'>> & { id: string };

async function updateOutcome({ id, ...changes }: OutcomeUpdate): Promise<Outcome> {
    const { data, error } = await supabase
        .from('outcomes')
        .update(changes)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export function useUpdateOutcome() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateOutcome,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: outcomesKey });
        },
    });
}

export type OutcomeCreate = Omit<Outcome, 'id' | 'created_at'>;

async function createOutcome(outcome: OutcomeCreate): Promise<Outcome> {
    const { data, error } = await supabase
        .from('outcomes')
        .insert(outcome)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export function useCreateOutcome() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createOutcome,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: outcomesKey });
        },
    });
}

export type OutcomeDelete = Pick<Outcome, 'id'>;

async function deleteOutcome(outcome: OutcomeDelete): Promise<string> {
    const { error } = await supabase
        .from('outcomes')
        .delete()
        .eq('id', outcome.id);

    if (error) throw error;
    return outcome.id;
}

export function useDeleteOutcome() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteOutcome,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: outcomesKey });
        },
    });
}
