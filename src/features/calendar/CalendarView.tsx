import React, { useState, useEffect } from 'react';
import { Layout } from '@components/layout/Layout';
import { Button } from '@components/ui/Button';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';
import calendarService, { CalendarDay } from '@services/calendarService';
import { useNavigate } from 'react-router-dom';
import './CalendarView.css';

export const CalendarView = () => {
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [summaryDays, setSummaryDays] = useState<CalendarDay[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchMonthlySummary();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentDate]);

    const fetchMonthlySummary = async () => {
        setLoading(true);
        setError(null);
        try {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1; // API expects 1-12
            const data = await calendarService.getMonthlySummary(year, month);
            setSummaryDays(data);
        } catch (err: any) {
            setError(err.message || 'Error loading calendar');
        } finally {
            setLoading(false);
        }
    };

    const handlePrevMonth = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() - 1);
        setCurrentDate(newDate);
    };

    const handleNextMonth = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + 1);
        setCurrentDate(newDate);
    };

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        // Adjust for Monday start (0=Sunday -> 6=Sunday, 1=Monday -> 0=Monday)
        const firstDayAdjusted = firstDay === 0 ? 6 : firstDay - 1;
        return { days, firstDay: firstDayAdjusted };
    };

    const renderCalendar = () => {
        const { days, firstDay } = getDaysInMonth(currentDate);
        const cells = [];

        // Empty cells for days before the 1st
        for (let i = 0; i < firstDay; i++) {
            cells.push(<div key={`empty-${i}`} className="calendar-day empty" />);
        }

        // Days of the month
        for (let day = 1; day <= days; day++) {
            // Find data for this day
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayData = summaryDays.find(d => d.date === dateStr);

            const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

            cells.push(
                <div
                    key={day}
                    className={`calendar-day ${isToday ? 'today' : ''} ${dayData ? 'has-data' : ''}`}
                    onClick={() => navigate(`/dashboard?date=${dateStr}`)}
                >
                    <span className="day-number">{day}</span>
                    {dayData && (
                        <>
                            <div className={`day-indicator ${dayData.isGoalMet ? 'indicator-met' : 'indicator-missed'}`} />
                            <span className="day-calories">{Math.round(dayData.totalCalories)}</span>
                        </>
                    )}
                </div>
            );
        }

        return cells;
    };

    return (
        <Layout>
            <div className="calendar-container">
                <div className="calendar-header">
                    <Button variant="secondary" size="sm" onClick={handlePrevMonth}>←</Button>
                    <div className="month-display">
                        {new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(currentDate)}
                    </div>
                    <Button variant="secondary" size="sm" onClick={handleNextMonth}>→</Button>
                </div>

                {loading && <LoadingSpinner />}
                {error && <div className="error-message">{error}</div>}

                {!loading && !error && (
                    <div className="calendar-grid">
                        <div className="weekday-header">Lun</div>
                        <div className="weekday-header">Mar</div>
                        <div className="weekday-header">Mié</div>
                        <div className="weekday-header">Jue</div>
                        <div className="weekday-header">Vie</div>
                        <div className="weekday-header">Sáb</div>
                        <div className="weekday-header">Dom</div>
                        {renderCalendar()}
                    </div>
                )}
            </div>
        </Layout>
    );
};
