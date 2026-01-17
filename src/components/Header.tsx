import React from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export const Header: React.FC = () => {
    const today = format(new Date(), 'M月d日 (EEE)', { locale: ja });

    return (
        <header className="bg-blue-600 text-white p-4 sticky top-0 z-10 shadow-md">
            <h1 className="text-xl font-bold">日報作成メモ</h1>
            <p className="text-sm opacity-90 mt-1 text-right">{today}</p>
        </header>
    );
};
