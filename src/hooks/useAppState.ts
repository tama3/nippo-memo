import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import type { AppState, Task } from '../types';

const STORAGE_KEY = 'nippo-memo-data';

// 初期状態を生成
const createInitialState = (): AppState => ({
    reportDate: format(new Date(), 'yyyy-MM-dd'),
    memo: '',
    tasks: [],
});

// LocalStorageからデータを読み込み、日付が変わっていたらリセット
const loadState = (): AppState => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            return createInitialState();
        }
        const parsed: AppState = JSON.parse(stored);
        const today = format(new Date(), 'yyyy-MM-dd');

        // 日付が変わっていたらリセット (Day Rotation)
        if (parsed.reportDate !== today) {
            console.log('[Nippo Memo] 日付が変わったためデータをリセットします');
            return createInitialState();
        }

        return parsed;
    } catch (error) {
        console.error('[Nippo Memo] LocalStorageの読み込みに失敗:', error);
        return createInitialState();
    }
};

// LocalStorageにデータを保存
const saveState = (state: AppState): void => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
        console.error('[Nippo Memo] LocalStorageへの保存に失敗:', error);
    }
};

export const useAppState = () => {
    const [state, setState] = useState<AppState>(loadState);

    // stateが変化したらLocalStorageに保存
    useEffect(() => {
        saveState(state);
    }, [state]);

    // タスクを追加
    const addTask = useCallback((taskInput: { name: string; quantity: number | ''; startTime: string; endTime: string }) => {
        const newTask: Task = {
            id: crypto.randomUUID(),
            name: taskInput.name,
            quantity: taskInput.quantity === '' ? 0 : taskInput.quantity,
            startTime: taskInput.startTime,
            endTime: taskInput.endTime,
        };
        setState((prev) => ({
            ...prev,
            tasks: [...prev.tasks, newTask],
        }));
    }, []);

    // タスクを削除
    const deleteTask = useCallback((id: string) => {
        setState((prev) => ({
            ...prev,
            tasks: prev.tasks.filter((t) => t.id !== id),
        }));
    }, []);

    // メモを更新
    const updateMemo = useCallback((memo: string) => {
        setState((prev) => ({
            ...prev,
            memo,
        }));
    }, []);

    return {
        tasks: state.tasks,
        memo: state.memo,
        reportDate: state.reportDate,
        addTask,
        deleteTask,
        updateMemo,
    };
};
