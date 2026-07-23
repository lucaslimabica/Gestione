// Hand-written until `npm run db:types` can be run against the real project
// (requires SUPABASE_PROJECT_ID in .env.local + `supabase login`).
// Mirrors the `post_its`, `vehicles`, `documents` and `document_types` tables, which mirror src/types.tsx's shapes.

import type { BudgetContent } from "@/types";

export interface Database {
    public: {
        Tables: {
            post_its: {
                Row: {
                    id: string;
                    created_at: string;
                    title: string;
                    content: string | null;
                    color: string;
                    priority: number;
                    start_date: string | null;
                    end_date: string | null;
                    deadline: string | null;
                    done: boolean | null;
                };
                Insert: {
                    id?: string;
                    created_at?: string;
                    title: string;
                    content?: string | null;
                    color?: string;
                    priority?: number;
                    start_date?: string | null;
                    end_date?: string | null;
                    deadline?: string | null;
                    done?: boolean | null;
                };
                Update: {
                    id?: string;
                    created_at?: string;
                    title?: string;
                    content?: string | null;
                    color?: string;
                    priority?: number;
                    start_date?: string | null;
                    end_date?: string | null;
                    deadline?: string | null;
                    done?: boolean | null;
                };
                Relationships: [];
            };
            vehicles: {
                Row: {
                    id: string;
                    created_at: string;
                    brand_model: string;
                    license_plate: string;
                    current_driver: string | null;
                    inspection_deadline: string | null;
                    insurance_deadline: string | null;
                    tax_deadline: string | null;
                    observation: string | null;
                };
                Insert: {
                    id?: string;
                    created_at?: string;
                    brand_model: string;
                    license_plate: string;
                    current_driver?: string | null;
                    inspection_deadline?: string | null;
                    insurance_deadline?: string | null;
                    tax_deadline?: string | null;
                    observation?: string | null;
                };
                Update: {
                    id?: string;
                    created_at?: string;
                    brand_model?: string;
                    license_plate?: string;
                    current_driver?: string | null;
                    inspection_deadline?: string | null;
                    insurance_deadline?: string | null;
                    tax_deadline?: string | null;
                    observation?: string | null;
                };
                Relationships: [];
            };
            documents: {
                Row: {
                    id: string;
                    created_at: string;
                    document_name: string;
                    document_type: string;
                    file_url: string | null;
                    observation: string | null;
                    content: BudgetContent | null;
                };
                Insert: {
                    id?: string;
                    created_at?: string;
                    document_name: string;
                    document_type: string;
                    file_url?: string | null;
                    observation?: string | null;
                    content?: BudgetContent | null;
                };
                Update: {
                    id?: string;
                    created_at?: string;
                    document_name?: string;
                    document_type?: string;
                    file_url?: string | null;
                    observation?: string | null;
                    content?: BudgetContent | null;
                };
                Relationships: [];
            };
            document_types: {
                Row: {
                    id: string;
                    created_at: string;
                    name: string;
                    is_budget: boolean;
                };
                Insert: {
                    id?: string;
                    created_at?: string;
                    name: string;
                    is_budget?: boolean;
                };
                Update: {
                    id?: string;
                    created_at?: string;
                    name?: string;
                    is_budget?: boolean;
                };
                Relationships: [];
            };
        };
        Views: Record<string, never>;
        Functions: Record<string, never>;
        Enums: Record<string, never>;
        CompositeTypes: Record<string, never>;
    };
}
