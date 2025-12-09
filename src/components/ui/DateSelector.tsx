import React from 'react';
import './DateSelector.css';

interface DateSelectorProps {
    selectedDate: Date;
    onDateChange: (date: Date) => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({ selectedDate, onDateChange }) => {

    const handlePrevDay = () => {
        const prevDate = new Date(selectedDate);
        prevDate.setDate(selectedDate.getDate() - 1);
        onDateChange(prevDate);
    };

    const handleNextDay = () => {
        const nextDate = new Date(selectedDate);
        nextDate.setDate(selectedDate.getDate() + 1);
        onDateChange(nextDate);
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const isTomorrow = (date: Date) => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return date.getDate() === tomorrow.getDate() &&
            date.getMonth() === tomorrow.getMonth() &&
            date.getFullYear() === tomorrow.getFullYear();
    };

    const isYesterday = (date: Date) => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return date.getDate() === yesterday.getDate() &&
            date.getMonth() === yesterday.getMonth() &&
            date.getFullYear() === yesterday.getFullYear();
    };

    const formatDateMain = (date: Date) => {
        if (isToday(date)) return 'Hoy';
        if (isYesterday(date)) return 'Ayer';
        if (isTomorrow(date)) return 'Mañana';
        return new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(date);
    };

    const formatDateSub = (date: Date) => {
        return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
    };

    return (
        <div className="date-selector">
            <button className="date-nav-btn" onClick={handlePrevDay} aria-label="Día anterior">
                ←
            </button>

            <div className="date-display">
                {isToday(selectedDate) && <span className="today-badge">Seleccionado</span>}
                <div className="date-main">{formatDateMain(selectedDate)}</div>
                <div className="date-sub">{formatDateSub(selectedDate)}</div>
            </div>

            <button className="date-nav-btn" onClick={handleNextDay} aria-label="Día siguiente">
                →
            </button>
        </div>
    );
};
