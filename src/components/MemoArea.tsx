import React from 'react';

interface MemoAreaProps {
    memo: string;
    onMemoChange: (memo: string) => void;
}

export const MemoArea: React.FC<MemoAreaProps> = ({ memo, onMemoChange }) => {
    return (
        <section className="p-4 border-t pb-8">
            <h2 className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">本日の感想</h2>
            <textarea
                className="w-full p-3 border rounded-md min-h-[100px] focus:ring-2 focus:ring-blue-500 outline-none resize-y text-sm"
                placeholder="気づきや連絡事項など..."
                value={memo}
                onChange={(e) => onMemoChange(e.target.value)}
            />
        </section>
    );
};
