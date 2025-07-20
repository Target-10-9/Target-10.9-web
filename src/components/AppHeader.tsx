import React from 'react';
import logo from '../assets/logo.png';

interface AppHeaderProps {
    title?: string;
    rightButton?: React.ReactNode;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ title = '', rightButton }) => {
    return (
        <header className="flex items-center justify-between px-8 py-4 bg-white shadow">
            <img src={logo} alt="Logo" className="h-14 w-14 rounded-full object-cover" />
            <span className="text-gray-800 text-lg font-medium">{title}</span>
            {rightButton ?? <div className="w-24" />}
        </header>
    );
};
