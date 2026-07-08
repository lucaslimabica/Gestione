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

export type VehicleCreate = Omit<Vehicle, 'id' | 'created_at'>; // This type has everything from vehicle except for id and created_at, 'cause this comes from the DB

async function createVehicle(vehicle: VehicleCreate): Promise<Vehicle> {
    const { data, error } = await supabase
        .from('vehicles')
        .insert(vehicle)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export function useCreateVehicle() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createVehicle,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: vehiclesKey });
        },
    });
}

export type VehicleDelete = Pick<Vehicle, 'id'>;

async function deleteVehicle(vehicle: VehicleDelete): Promise<string> {
    const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', vehicle.id);

    if (error) throw error;
    return vehicle.id;
}

export function useDeleteVehicle() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteVehicle,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: vehiclesKey })
        },
    });
}