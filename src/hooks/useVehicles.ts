import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";
import type { Vehicle } from "@/types";

export const vehiclesKey = ['vehicles'] as const;

async function fetchVehicles(): Promise<Vehicle[]> {
    const { data, error } = await supabase
        .from('vehicles')
        .select('*');

    if (error) throw error;
    return data;
}

export function useVehicles() {
    return useQuery({
        queryKey: vehiclesKey,
        queryFn: fetchVehicles,
    });
}

export type VehicleUpdate = Partial<Omit<Vehicle, 'id' | 'created_at'>> & { id: string };

async function updateVehicle({ id, ...changes }: VehicleUpdate): Promise<Vehicle> {
    const { data, error } = await supabase
        .from('vehicles')
        .update(changes)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export function useUpdateVehicle() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateVehicle,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: vehiclesKey });
        },
    });
}
