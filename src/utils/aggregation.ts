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

// 分を「時間分」形式に変換
export const formatMinutes = (totalMinutes: number): string => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours === 0) return `${minutes}分`;
    return `${hours}時間${minutes}分`;
};

// 2つの時間範囲が重複しているかどうかをチェック
export const isTimeOverlapping = (
    start1: string, end1: string,
    start2: string, end2: string
): boolean => {
    const s1 = timeToMinutes(start1);
    const e1 = timeToMinutes(end1);
    const s2 = timeToMinutes(start2);
    const e2 = timeToMinutes(end2);
    // 重複の条件: 一方の開始が他方の終了より前 かつ 一方の終了が他方の開始より後
    return s1 < e2 && e1 > s2;
};

// 新しいタスクが既存のタスクと時間が重複しているかチェック
export const findOverlappingTask = (
    tasks: Task[],
    newStartTime: string,
    newEndTime: string
): Task | undefined => {
    if (!newStartTime || !newEndTime) return undefined;

    return tasks.find(task => {
        if (!task.startTime || !task.endTime) return false;
        return isTimeOverlapping(newStartTime, newEndTime, task.startTime, task.endTime);
    });
};

// タスクをグループ化して集計
export interface TaskGroup {
    name: string;
    totalQuantity: number;
    totalDuration: number; // 分単位
    timeRanges: { startTime: string; endTime: string }[];
    firstStartTime: string; // ソート用
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
                // より早い開始時間があれば更新
                if (task.startTime < existing.firstStartTime) {
                    existing.firstStartTime = task.startTime;
                }
            }
        } else {
            grouped.set(task.name, {
                name: task.name,
                totalQuantity: task.quantity,
                totalDuration: duration,
                timeRanges: hasValidTime ? [{ startTime: task.startTime, endTime: task.endTime }] : [],
                firstStartTime: task.startTime || '99:99', // 未入力は末尾に
            });
        }
    }

    // 開始時間順にソート
    return Array.from(grouped.values()).sort((a, b) =>
        a.firstStartTime.localeCompare(b.firstStartTime)
    );
};

// 日報フォーマット用テキスト生成
export const generateReportText = (groups: TaskGroup[]): string => {
    if (groups.length === 0) {
        return '';
    }

    return groups.map((group) => {
        const quantityPart = group.totalQuantity > 0 ? `数量: ${group.totalQuantity}\n` : '';
        const durationText = group.totalDuration >= 60
            ? `${group.totalDuration}分 (${formatMinutes(group.totalDuration)})`
            : `${group.totalDuration}分`;
        const header = `【${group.name}】\n${quantityPart}所要時間: ${durationText}`;
        // const timeLines = group.timeRanges
        //     .map(({ startTime, endTime }) => `　${startTime} ～ ${endTime}`)
        //     .join('\n');
        // return `${header}\n${timeLines}`;
        return `${header}`;
    }).join('\n\n');
};
