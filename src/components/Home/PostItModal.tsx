import { X, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useUpdatePostIt, useDeletePostIt } from "@/hooks/usePostIts";
import type { PostIt } from "@/types";

interface PostItModalProps {
    postIt: PostIt;
    onClose: () => void;
}

const PRIORITY_OPTIONS = [
    { value: 1, label: 'Baixa' },
    { value: 2, label: 'Média' },
    { value: 3, label: 'Alta' },
];

export default function PostItModal({ postIt, onClose }: PostItModalProps) { // Here it uses the PostIt already created
    const [title, setTitle] = useState(postIt.title);
    const [content, setContent] = useState(postIt.content ?? '');
    const [color, setColor] = useState(postIt.color || '#FEF08A');
    const [priority, setPriority] = useState(postIt.priority);
    const [startDate, setStartDate] = useState(postIt.start_date ?? '');
    //const [endDate, setEndDate] = useState(postIt.end_date ?? '');
    const [deadline, setDeadline] = useState(postIt.deadline ?? '');
    const [done, setDone] = useState(postIt.done);

    // Show delete confirmation buttons
    const [isConfirmationButtonVisible, setIsConfirmationButtonVisible] = useState(false);

    const { mutate, isPending, error } = useUpdatePostIt();
    const { mutate: deletePostIt, isPending: isDeleting } = useDeletePostIt();


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
                id: postIt.id,
                title,
                content: content || null,
                color,
                priority,
                start_date: startDate || null,
                end_date: null,
                deadline: deadline || null,
                done,
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
                        placeholder="Título"
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
                    placeholder="Conteúdo"
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
                    </label>
                    <button 
                        onClick={() => setIsConfirmationButtonVisible(true)}
                        className="rounded bg-red-500 hover:bg-red-800 text-white p-2 text-sm font-small font-bold inline-flex items-center gap-x-1.5"
                    >
                        <Trash2 />
                        <span>Excluir</span>
                    </button>
                    <div className="inline-flex">
                        <button
                            onClick={() => deletePostIt({ id: postIt.id }, { onSuccess: onClose })}
                            disabled={isDeleting}
                            className={`bg-gray-300 hover:bg-gray-400 text-gray-800 text-xs font-bold py-2 px-4 rounded-l transition-all duration-300 ${isConfirmationButtonVisible ? "block opacity-100" : "hidden opacity-0"}`}
                        >
                            <span>Sim</span>
                        </button>
                        <button
                            onClick={() => setIsConfirmationButtonVisible(false)} 
                            className={`bg-gray-300 hover:bg-gray-400 text-gray-800 text-xs font-bold py-2 px-4 rounded-r transition-all duration-300 ${isConfirmationButtonVisible ? "block opacity-100" : "hidden opacity-0"}`}
                        >
                            <span>Não</span>
                        </button>
                    </div>
                </div>

                {error && (
                    <p className="mt-3 text-xs font-medium text-red-700">
                        Não foi possível salvar. Tente novamente.
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
                        {isPending ? 'Salvando...' : 'Salvar'}
                    </button>
                </div>
            </div>
        </div>
    );
}
