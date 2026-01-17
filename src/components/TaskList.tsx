import React, { useState, useMemo } from 'react';
import { Trash2, Pencil, ChevronDown, ChevronRight } from 'lucide-react';
import type { Task } from '../types';

interface TaskListProps {
    tasks: Task[];
    onDelete: (id: string) => void;
    onEdit: (task: Task) => void;
    disableEdit?: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onDelete, onEdit, disableEdit = false }) => {
    // デフォルトは閉じた状態
    const [isOpen, setIsOpen] = useState(false);

    // 開始時間順にソート（時間未入力のものは末尾に）
    const sortedTasks = useMemo(() => {
        return [...tasks].sort((a, b) => {
            if (!a.startTime && !b.startTime) return 0;
            if (!a.startTime) return 1;
            if (!b.startTime) return -1;
            return a.startTime.localeCompare(b.startTime);
        });
    }, [tasks]);

    if (tasks.length === 0) {
        return null; // リストが空の場合は折り畳みも表示しない
    }

    return (
        <section className="p-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide w-full text-left hover:text-gray-700 transition-colors"
            >
                {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                作業リスト ({tasks.length}件)
            </button>

            {isOpen && (
                <ul className="space-y-2">
                    {sortedTasks.map((task) => (
                        <li key={task.id} className="bg-white border rounded-lg p-3 shadow-sm flex justify-between items-center group">
                            <div className="flex-1">
                                <div className="flex justify-between items-baseline mb-1">
                                    <span className="font-bold text-gray-800">{task.name}</span>
                                    {task.quantity > 0 && (
                                        <span className="text-sm font-mono bg-blue-50 text-blue-700 px-2 rounded">
                                            {task.quantity.toLocaleString()} <span className="text-xs">件</span>
                                        </span>
                                    )}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {task.startTime} ～ {task.endTime}
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => onEdit(task)}
                                    disabled={disableEdit}
                                    className={`ml-2 p-2 rounded-full transition-colors ${disableEdit
                                        ? 'text-gray-300 cursor-not-allowed'
                                        : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'
                                        }`}
                                    aria-label="編集"
                                >
                                    <Pencil size={18} />
                                </button>
                                <button
                                    onClick={() => {
                                        if (window.confirm('この作業を削除しますか？')) {
                                            onDelete(task.id);
                                        }
                                    }}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                    aria-label="削除"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};
