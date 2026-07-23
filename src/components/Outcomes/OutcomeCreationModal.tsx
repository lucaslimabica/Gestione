// The modal/pop-up to be shown as you click "Nova Saída"

import { X } from "lucide-react";
import { useEffect, useState } from "react";

import { useCreateOutcome } from "@/hooks/useOutcomes";

interface OutcomeCreationModalProps {
    onClose: () => void;
}

export default function OutcomeCreationModal({ onClose }: OutcomeCreationModalProps) {
    const [description, setDescription] = useState('');
    const [value, setValue] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [paid, setPaid] = useState(false);
    const [observation, setObservation] = useState('');

    const { mutate, isPending, error } = useCreateOutcome();

    useEffect(() => { // This block is for the closer as 'Esc' is pressed
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [onClose]);

    const handleSave = () => {
        mutate( // This is the create function
            {
                description,
                value: Number(value) || 0,
                due_date: dueDate,
                paid,
                observation: observation || null,
            },
            { onSuccess: onClose },
        );
    };

    // The forms
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
        >
            <div
                className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl border border-border-main bg-surface p-5 text-main shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-2">
                    <input
                        className="w-full rounded bg-base px-2 py-1 text-lg font-semibold outline-none focus:ring-2 focus:ring-primary"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Descrição da saída"
                        autoFocus
                    />
                    <button
                        className="shrink-0 rounded-full p-1 hover:bg-base"
                        onClick={onClose}
                        aria-label="Fechar"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                    <label className="text-xs font-medium text-main/70">
                        Valor (€)
                        <input
                            type="number"
                            step="0.01"
                            className="mt-1 w-full rounded bg-base px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="0,00"
                        />
                    </label>
                    <label className="text-xs font-medium text-main/70">
                        Vencimento
                        <input
                            type="date"
                            className="mt-1 w-full rounded bg-base px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                    </label>
                    <label className="text-xs font-medium text-main/70">
                        Status
                        <select
                            className="mt-1 w-full rounded bg-base px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                            value={paid ? 'paid' : 'pending'}
                            onChange={(e) => setPaid(e.target.value === 'paid')}
                        >
                            <option value="pending">Pendente</option>
                            <option value="paid">Pago</option>
                        </select>
                    </label>
                </div>

                <textarea
                    className="mt-3 w-full resize-none rounded bg-base px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                    value={observation}
                    onChange={(e) => setObservation(e.target.value)}
                    placeholder="Observação"
                />

                {error && (
                    <p className="mt-3 text-xs font-medium text-red-600">
                        Não foi possível criar. Tente novamente.
                    </p>
                )}

                <div className="mt-4 flex justify-end gap-2">
                    <button
                        className="rounded px-3 py-1.5 text-sm font-medium hover:bg-base"
                        onClick={onClose}
                        disabled={isPending}
                    >
                        Cancelar
                    </button>
                    <button
                        className="rounded bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-60"
                        onClick={handleSave}
                        disabled={isPending || !description.trim() || !value || !dueDate}
                    >
                        {isPending ? 'Criando...' : 'Criar'}
                    </button>
                </div>
            </div>
        </div>
    );
}
