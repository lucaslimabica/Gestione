export interface PostIt {
    id: string;
    created_at: string;
    title: string;
    content: string | null;
    color: string;
    priority: number; // Levels for 1 to 3
    start_date: string | null;
    end_date: string | null;
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