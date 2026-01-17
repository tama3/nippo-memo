import React from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export const Header: React.FC = () => {
    const today = format(new Date(), 'M月d日 (EEE)', { locale: ja });

    return (
        <header className="bg-blue-600 text-white p-4 sticky top-0 z-10 shadow-md">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">日報作成メモ</h1>
                <span className="text-xs opacity-60">v{__APP_VERSION__}</span>
            </div>
            <p className="text-sm opacity-90 mt-1 text-right">{today}</p>
        </header>
    );
};
