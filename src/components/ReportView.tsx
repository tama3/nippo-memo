import React from 'react';
import type { Task } from '../types';
import { aggregateTasks, generateReportText, type TaskGroup } from '../utils/aggregation';

interface ReportViewProps {
    tasks: Task[];
}

export const ReportView: React.FC<ReportViewProps> = ({ tasks }) => {
    const groups: TaskGroup[] = React.useMemo(() => aggregateTasks(tasks), [tasks]);
    const reportText = React.useMemo(() => generateReportText(groups), [groups]);

    if (tasks.length === 0) {
        return (
            <section className="p-4 bg-gray-50 border-t">
                <h2 className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">日報プレビュー</h2>
                <div className="bg-white p-4 rounded-md border text-sm text-gray-400 text-center">
                    作業を追加すると、ここに集計結果が表示されます
                </div>
            </section>
        );
    }

    return (
        <section className="p-4 bg-gray-50 border-t">
            <h2 className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">日報プレビュー</h2>
            <div className="bg-white p-4 rounded-md border text-sm font-mono whitespace-pre-wrap">
                {reportText}
            </div>
        </section>
    );
};
