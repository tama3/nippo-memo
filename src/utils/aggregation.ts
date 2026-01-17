import type { Task } from '../types';

// 時間文字列 (HH:MM) を分に変換
export const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};

// 所要時間を分単位で計算
export const calculateDuration = (startTime: string, endTime: string): number => {
    return timeToMinutes(endTime) - timeToMinutes(startTime);
};

// タスクをグループ化して集計
export interface TaskGroup {
    name: string;
    totalQuantity: number;
    totalDuration: number; // 分単位
    timeRanges: { startTime: string; endTime: string }[];
}

export const aggregateTasks = (tasks: Task[]): TaskGroup[] => {
    const grouped = new Map<string, TaskGroup>();

    for (const task of tasks) {
        const existing = grouped.get(task.name);
        // 時間が両方入力されている場合のみ計算
        const hasValidTime = task.startTime && task.endTime;
        const duration = hasValidTime ? calculateDuration(task.startTime, task.endTime) : 0;

        if (existing) {
            existing.totalQuantity += task.quantity;
            existing.totalDuration += duration;
            if (hasValidTime) {
                existing.timeRanges.push({
                    startTime: task.startTime,
                    endTime: task.endTime,
                });
            }
        } else {
            grouped.set(task.name, {
                name: task.name,
                totalQuantity: task.quantity,
                totalDuration: duration,
                timeRanges: hasValidTime ? [{ startTime: task.startTime, endTime: task.endTime }] : [],
            });
        }
    }

    return Array.from(grouped.values());
};

// 日報フォーマット用テキスト生成
export const generateReportText = (groups: TaskGroup[]): string => {
    if (groups.length === 0) {
        return '';
    }

    return groups.map((group) => {
        const quantityPart = group.totalQuantity > 0 ? `数量: ${group.totalQuantity}\n` : '';
        const header = `【${group.name}】\n${quantityPart}所要時間: ${group.totalDuration}分`;
        // const timeLines = group.timeRanges
        //     .map(({ startTime, endTime }) => `　${startTime} ～ ${endTime}`)
        //     .join('\n');
        // return `${header}\n${timeLines}`;
        return `${header}`;
    }).join('\n\n');
};
