// アプリケーションの状態を表す型定義

export interface Task {
    id: string;        // UUID
    name: string;      // 作業名
    quantity: number;  // 数量 (件数、枚数など)
    startTime: string; // "09:00" (HH:MM形式)
    endTime: string;   // "10:30" (HH:MM形式)
}

export interface AppState {
    reportDate: string; // YYYY-MM-DD (リセット判定用)
    memo: string;       // フリーテキスト
    tasks: Task[];
}
