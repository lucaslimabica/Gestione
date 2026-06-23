// routes/Home.tsx to be rendered at the root/index route of the app. This is the first page users see when they visit the app.
import { PostIt } from "@/types";
import { PostItCard } from "@/components/Home/PostItCard";
import { useState } from "react";

export function Home() {

    // Mocking some post its
    const [postItsList, setPostItsList] = useState<PostIt[]>([
        {
            id: '1',
            created_at: '',
            title: 'Reunião',
            content: 'Discutir as metas de faturação e organização da frota.',
            color: '#f6953b',
            priority: 1,
            start_date: '2026-06-23',
            end_date: null,
            deadline: null
        },  
        {
            id: '2',
            created_at: '',
            title: 'Revisão do Jetta 01',
            content: 'Levar o veículo à oficina para troca de óleo. DATA FATAL!',
            color: '#efb944',
            priority: 3,
            start_date: '2026-06-24',
            end_date: null,
            deadline: '2026-06-25'
        }
    ]);
    
    return (
        <div className="flex min-h-screen items-center justify-center bg-base text-main">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-main tracking-tight">
                    Quadro
                </h1>
                <p className="mt-2 text-slate-400">Aqui Ficarão seus Post-it's</p>
                <div className="custom-button mt-4">{/*Empty*/}</div>
            </div>
        </div>
    );
}
