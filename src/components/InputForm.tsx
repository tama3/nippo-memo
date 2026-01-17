import React, { useState } from 'react';
import { Plus } from 'lucide-react';

export interface TaskInput {
    name: string;
    quantity: number | '';
    startTime: string;
    endTime: string;
}

interface InputFormProps {
    input: TaskInput;
    onChange: (input: TaskInput) => void;
    onAdd: (task: TaskInput) => void;
    taskNameSuggestions: string[];
    externalError?: string;
}

export const InputForm: React.FC<InputFormProps> = ({ input, onChange, onAdd, taskNameSuggestions, externalError }) => {
    const [error, setError] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.name) {
            setError('作業名を入力してください');
            return;
        }
        if (input.quantity !== '' && input.quantity < 0) {
            setError('数量は0以上の数値を入力してください');
            return;
        }
        // 終了時間が開始時間より前の場合はエラー
        if (input.startTime && input.endTime && input.endTime <= input.startTime) {
            setError('終了時間は開始時間より後にしてください');
            return;
        }

        setError('');
        onAdd(input);
    };

    // どちらかのエラーを表示
    const displayError = error || externalError;

    return (
        <section className="p-4 bg-gray-50 border-b">
            <h2 className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">新しい作業</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                    <input
                        type="text"
                        placeholder="作業名"
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        value={input.name}
                        onChange={(e) => onChange({ ...input, name: e.target.value })}
                        list="task-name-suggestions"
                    />
                    <datalist id="task-name-suggestions">
                        {taskNameSuggestions.map((name) => (
                            <option key={name} value={name} />
                        ))}
                    </datalist>
                </div>

                <div>
                    <input
                        type="number"
                        placeholder="数量"
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        value={input.quantity}
                        onChange={(e) => onChange({ ...input, quantity: e.target.value === '' ? '' : Number(e.target.value) })}
                    />
                </div>

                <div className="flex gap-2">
                    <input
                        type="time"
                        className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        value={input.startTime}
                        onChange={(e) => onChange({ ...input, startTime: e.target.value })}
                        aria-label="開始時間"
                    />
                    <span className="self-center text-gray-400">～</span>
                    <input
                        type="time"
                        className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        value={input.endTime}
                        onChange={(e) => onChange({ ...input, endTime: e.target.value })}
                        aria-label="終了時間"
                    />
                </div>

                {displayError && <p className="text-red-500 text-sm font-medium">{displayError}</p>}

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md flex items-center justify-center gap-2 transition-colors shadow-sm active:scale-[0.98]"
                >
                    <Plus size={20} />
                    追加
                </button>
            </form>
        </section>
    );
};
