// The modal/pop-up to be shown as you click on the income card

import { X, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import { useUpdateIncome, useDeleteIncome } from "@/hooks/useIncomes";
import type { Income } from "@/types";

interface IncomeModalProps {
    income: Income;
    onClose: () => void;
}

export default function IncomeModal({ income, onClose }: IncomeModalProps) {
    const [description, setDescription] = useState(income.description);
    const [value, setValue] = useState(String(income.value));
    const [dueDate, setDueDate] = useState(income.due_date);
    const [paid, setPaid] = useState(income.paid);
    const [observation, setObservation] = useState(income.observation ?? '');

    // Show delete confirmation buttons
    const [isConfirmationButtonVisible, setIsConfirmationButtonVisible] = useState(false);

    const { mutate, isPending, error } = useUpdateIncome();
    const { mutate: deleteIncome, isPending: isDeleting } = useDeleteIncome();

    useEffect(() => { // This block is for the closer as 'Esc' is pressed
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [onClose]);

    const handleSave = () => {
        mutate( // This is the updated function
            {
                id: income.id,
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
                        placeholder="Descrição da entrada"
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
                            <option value="paid">Recebido</option>
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

                <div className="mt-3 flex items-center justify-between border-t border-border-main pt-3">
                    <button
                        onClick={() => setIsConfirmationButtonVisible(true)}
                        className="rounded bg-red-500 hover:bg-red-800 text-white p-2 text-sm font-small font-bold inline-flex items-center gap-x-1.5"
                    >
                        <Trash2 />
                        <span>Excluir</span>
                    </button>
                    <div className="inline-flex">
                        <button
                            onClick={() => deleteIncome({ id: income.id }, { onSuccess: onClose })}
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
                    <p className="mt-3 text-xs font-medium text-red-600">
                        Não foi possível salvar. Tente novamente.
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
                        {isPending ? 'Salvando...' : 'Salvar'}
                    </button>
                </div>
            </div>
        </div>
    );
}
