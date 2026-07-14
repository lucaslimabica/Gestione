export interface PostIt {
    id: string;
    created_at: string;
    title: string;
    content: string | null;
    color: string;
    priority: number; // Levels for 1 to 3
    start_date: string | null;
    end_date: string | null;
    done: boolean | null;
    deadline: string | null;
}

export interface Vehicle {
    id: string;
    created_at: string;
    brand_model: string;
    license_plate: string;
    current_driver: string | null;
    inspection_deadline: string | null;
    insurance_deadline: string | null;
    tax_deadline: string | null;
    observation: string | null;
}

// A document inside DB has this type
export interface DocumentRow {
  id: string;
  created_at: string;
  document_name: string;
  document_type: 'quote' | 'contract' | 'id_card' | 'license'; // possibles types
  file_url: string | null; // Nullable if the quote is generated inside Gestione
  observation: string | null;
  content: BudgetContent | null; // Budget content if its Gestione Generated
}

// The budget-type to be used as PDF structure 
export interface BudgetContent {
  id_comercial: string; // Ex: "65/2026"
  description: string;
  items: Array<{ description: string; value: number }>;
  total_value: number;
  payment_terms: string;
}