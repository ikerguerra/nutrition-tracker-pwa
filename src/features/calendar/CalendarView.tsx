import { useState, useEffect } from 'react';
import { Layout } from '@components/layout/Layout';
import { Button } from '@components/ui/button';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';
import calendarService, { CalendarDay } from '@services/calendarService';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

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
            cells.push(<div key={`empty-${i}`} className="bg-transparent pointer-events-none" />);
        }

        // Days of the month
        for (let day = 1; day <= days; day++) {
            // Find data for this day
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayData = summaryDays.find(d => d.date === dateStr);

            const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

            // Calorie Status Logic
            let statusIcon = null;
            if (dayData && dayData.totalCalories > 0) {
                const diff = Math.abs(dayData.totalCalories - (dayData.calorieGoal || 2000)); // Default fallback if needed
                const isMet = diff <= 50;

                statusIcon = isMet ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500 fill-green-500/10" />
                ) : (
                    <XCircle className="h-4 w-4 text-red-500 fill-red-500/10" />
                );
            }

            cells.push(
                <div
                    key={day}
                    className={cn(
                        "relative flex flex-col items-center justify-start p-1 md:p-2 rounded-xl transition-all duration-200 border cursor-pointer hover:shadow-md hover:-translate-y-0.5 group",
                        isToday ? "border-primary bg-primary/5 shadow-sm" : "border-transparent bg-card hover:border-primary/20",
                        !dayData ? "opacity-50 hover:opacity-100" : ""
                    )}
                    onClick={() => navigate(`/dashboard?date=${dateStr}`)}
                >
                    <span className={cn(
                        "text-sm font-semibold mb-1 w-6 h-6 flex items-center justify-center rounded-full",
                        isToday ? "bg-primary text-primary-foreground" : "text-foreground"
                    )}>
                        {day}
                    </span>

                    {dayData && (
                        <div className="flex flex-col items-center gap-1 mt-auto w-full">
                            {statusIcon}
                            <span className="text-[10px] md:text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                                {Math.round(dayData.totalCalories)}
                            </span>
                        </div>
                    )}
                </div>
            );
        }

        return cells;
    };

    const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

    return (
        <Layout>
            <div className="flex flex-col h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] p-4 md:p-6 overflow-hidden">
                <div className="flex items-center justify-between mb-4 flex-shrink-0">
                    <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="hover:bg-secondary/50">
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400 capitalize">
                        {new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(currentDate)}
                    </h2>
                    <Button variant="ghost" size="icon" onClick={handleNextMonth} className="hover:bg-secondary/50">
                        <ChevronRight className="h-6 w-6" />
                    </Button>
                </div>

                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <LoadingSpinner />
                    </div>
                ) : error ? (
                    <div className="flex-1 flex items-center justify-center text-destructive">{error}</div>
                ) : (
                    <div className="flex-1 grid grid-cols-7 grid-rows-[auto_1fr] gap-2 md:gap-4 min-h-0">
                        {weekDays.map(day => (
                            <div key={day} className="text-center font-medium text-muted-foreground text-sm py-2">
                                {day}
                            </div>
                        ))}
                        <div className="col-span-7 grid grid-cols-7 grid-rows-5 md:grid-rows-5 gap-2 md:gap-4 h-full">
                            {/* Note: We are using a nested grid here to ensure the cells fill the height strictly. 
                                 The number of rows might vary (4, 5, or 6) depending on the month. 
                                 For a perfect 'full height' look, CSS Grid auto-rows is better.
                             */}
                            {renderCalendar()}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};
