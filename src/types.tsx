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