import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './button';
import './DateCarousel.css';

interface DateCarouselProps {
    selectedDate: Date;
    onDateChange: (date: Date) => void;
}

export const DateCarousel: React.FC<DateCarouselProps> = ({ selectedDate, onDateChange }) => {
    const [direction, setDirection] = useState(0);

    const handlePrevDay = () => {
        setDirection(-1);
        const prevDate = new Date(selectedDate);
        prevDate.setDate(selectedDate.getDate() - 1);
        onDateChange(prevDate);
    };

    const handleNextDay = () => {
        setDirection(1);
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

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0,
            scale: 0.95
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 50 : -50,
            opacity: 0,
            scale: 0.95
        })
    };

    return (
        <div className="date-carousel">
            <Button
                variant="secondary"
                size="sm"
                className="carousel-nav-btn"
                onClick={handlePrevDay}
                aria-label="Día anterior"
            >
                ←
            </Button>

            <div className="carousel-display">
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                    <motion.div
                        key={selectedDate.toISOString()}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        className="carousel-content"
                    >
                        {isToday(selectedDate) && (
                            <motion.span
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="today-badge"
                            >
                                Seleccionado
                            </motion.span>
                        )}
                        <div className="date-main">{formatDateMain(selectedDate)}</div>
                        <div className="date-sub">{formatDateSub(selectedDate)}</div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <Button
                variant="secondary"
                size="sm"
                className="carousel-nav-btn"
                onClick={handleNextDay}
                aria-label="Día siguiente"
            >
                →
            </Button>
        </div>
    );
};
