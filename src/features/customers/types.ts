// features/customers/types.ts
import type { Database } from '@/lib/database.types';

export type Customer = Database['public']['Tables']['customers']['Row']; // To read a customer from the database
export type NewCustomer = Database['public']['Tables']['customers']['Insert']; // To create a new customer in the database
export type UpdateCustomer =
    Database['public']['Tables']['customers']['Update']; // To update an existing customer in the database

// ToDo: Add nested types for related tables, e.g., orders, cards, companies, etc.
