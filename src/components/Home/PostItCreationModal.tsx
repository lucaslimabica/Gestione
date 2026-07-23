import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCreatePostIt } from "@/hooks/usePostIts";

interface PostItCreationModalProps {
    onClose: () => void;
}

const PRIORITY_OPTIONS = [
    { value: 1, label: 'Baixa' },
    { value: 2, label: 'Média' },
    { value: 3, label: 'Alta' },
];

const DEFAULT_COLOR = '#FEF08A';

export default function PostItCreationModal({ onClose }: PostItCreationModalProps) { // Whitout any PostIt as parameter cause we are about to create it
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [color, setColor] = useState(DEFAULT_COLOR);
    const [priority, setPriority] = useState(1);
    const [startDate, setStartDate] = useState('');
    // const [endDate, setEndDate] = useState('');
    const [deadline, setDeadline] = useState('');
    const [done, setDone] = useState(false);
    const [responsible, setResponsible] = useState('');
    const [location, setLocation] = useState('');

    const { mutate, isPending, error } = useCreatePostIt();

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [onClose]);

    const handleSave = () => {
        mutate(
            {
                title,
                content: content || null,
                color,
                priority,
                start_date: startDate || null,
                end_date: null,
                done,
                deadline: deadline || null,
                responsible: responsible || null,
                location: location || null,
            },
            { onSuccess: onClose },
        );
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md rounded-xl p-5 text-slate-900 shadow-2xl"
                style={{ backgroundColor: color }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-2">
                    <input
                        className="w-full rounded bg-white/40 px-2 py-1 text-lg font-semibold outline-none focus:bg-white/60"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Novo Lembrete"
                        autoFocus
                    />
                    <button
                        className="shrink-0 rounded-full p-1 hover:bg-black/10"
                        onClick={onClose}
                        aria-label="Fechar"
                    >
                        <X size={18} />
                    </button>
                </div>

                <textarea
                    className="mt-3 w-full resize-none rounded bg-white/40 px-2 py-1.5 text-sm outline-none focus:bg-white/60"
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="O que deve ser escrito no lembrete?"
                />

                <div className="mt-3 grid grid-cols-2 gap-3">
                    <label className="text-xs font-medium text-slate-700">
                        Cor
                        <input
                            type="color"
                            className="mt-1 h-8 w-full cursor-pointer rounded border border-black/10"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                        />
                    </label>
                    <label className="text-xs font-medium text-slate-700">
                        Prioridade
                        <select
                            className="mt-1 w-full rounded bg-white/40 px-2 py-1.5 text-sm outline-none focus:bg-white/60"
                            value={priority}
                            onChange={(e) => setPriority(Number(e.target.value))}
                        >
                            {PRIORITY_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </label>
                    <label className="text-xs font-medium text-slate-700">
                        Início
                        <input
                            type="date"
                            className="mt-1 w-full rounded bg-white/40 px-2 py-1.5 text-sm outline-none focus:bg-white/60"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </label>
                    <label className="text-xs font-medium text-slate-700">
                        Prazo
                        <input
                            type="date"
                            className="mt-1 w-full rounded bg-white/40 px-2 py-1.5 text-sm outline-none focus:bg-white/60"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                        />
                    </label>
                    <label className="text-xs font-medium text-slate-700">
                        Status
                        <select
                            id="status"
                            name="status"
                            className="mt-1 w-full rounded bg-white/40 px-2 py-1.5 text-sm outline-none focus:bg-white/60"
                            value={done ? 'done' : 'pending'}
                            onChange={(e) => setDone(e.target.value === 'done')}
                        >
                            <option value="pending">Pendente</option>
                            <option value="done">Feito</option>
                        </select>
                    </label>
                    <label className="text-xs font-medium text-slate-700">
                        Responsável
                        <input
                            className="mt-1 w-full rounded bg-white/40 px-2 py-1.5 text-sm outline-none focus:bg-white/60"
                            value={responsible}
                            onChange={(e) => setResponsible(e.target.value)}
                            placeholder="Nome"
                        />
                    </label>
                    <label className="text-xs font-medium text-slate-700">
                        Localização
                        <input
                            className="mt-1 w-full rounded bg-white/40 px-2 py-1.5 text-sm outline-none focus:bg-white/60"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Local"
                        />
                    </label>
                </div>

                {error && (
                    <p className="mt-3 text-xs font-medium text-red-700">
                        Não foi possível criar o post-it. Tente novamente.
                    </p>
                )}

                <div className="mt-4 flex justify-end gap-2">
                    <button
                        className="rounded px-3 py-1.5 text-sm font-medium hover:bg-black/10"
                        onClick={onClose}
                        disabled={isPending}
                    >
                        Cancelar
                    </button>
                    <button
                        className="rounded bg-black/80 px-3 py-1.5 text-sm font-medium text-white hover:bg-black disabled:opacity-60"
                        onClick={handleSave}
                        disabled={isPending || !title.trim()}
                    >
                        {isPending ? 'Criando...' : 'Criar'}
                    </button>
                </div>
            </div>
        </div>
    );
}
