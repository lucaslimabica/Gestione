import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Income } from "@/types";

export const incomesKey = ['incomes'] as const;

async function fetchIncomes(): Promise<Income[]> {
    const { data, error } = await supabase
        .from('incomes')
        .select('*')
        .order('due_date', { ascending: true });

    if (error) throw error;
    return data;
}

export function useIncomes() {
    return useQuery({
        queryKey: incomesKey,
        queryFn: fetchIncomes,
    });
}

export type IncomeUpdate = Partial<Omit<Income, 'id' | 'created_at'>> & { id: string };

async function updateIncome({ id, ...changes }: IncomeUpdate): Promise<Income> {
    const { data, error } = await supabase
        .from('incomes')
        .update(changes)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export function useUpdateIncome() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateIncome,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: incomesKey });
        },
    });
}

export type IncomeCreate = Omit<Income, 'id' | 'created_at'>;

async function createIncome(income: IncomeCreate): Promise<Income> {
    const { data, error } = await supabase
        .from('incomes')
        .insert(income)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export function useCreateIncome() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createIncome,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: incomesKey });
        },
    });
}

export type IncomeDelete = Pick<Income, 'id'>;

async function deleteIncome(income: IncomeDelete): Promise<string> {
    const { error } = await supabase
        .from('incomes')
        .delete()
        .eq('id', income.id);

    if (error) throw error;
    return income.id;
}

export function useDeleteIncome() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteIncome,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: incomesKey });
        },
    });
}
