import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DateCarousel } from './DateCarousel';

describe('DateCarousel', () => {
    const mockOnDateChange = vi.fn();

    beforeEach(() => {
        mockOnDateChange.mockClear();
    });

    it('should display "Today" for current date', () => {
        const today = new Date();
        render(<DateCarousel selectedDate={today} onDateChange={mockOnDateChange} />);

        expect(screen.getByText(/today/i)).toBeInTheDocument();
    });

    it('should display "Yesterday" for yesterday date', () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        render(<DateCarousel selectedDate={yesterday} onDateChange={mockOnDateChange} />);

        expect(screen.getByText(/yesterday/i)).toBeInTheDocument();
    });

    it('should display "Tomorrow" for tomorrow date', () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        render(<DateCarousel selectedDate={tomorrow} onDateChange={mockOnDateChange} />);

        expect(screen.getByText(/tomorrow/i)).toBeInTheDocument();
    });

    it('should call onDateChange when clicking next button', () => {
        const today = new Date();
        render(<DateCarousel selectedDate={today} onDateChange={mockOnDateChange} />);

        const nextButton = screen.getByLabelText(/next day/i);
        fireEvent.click(nextButton);

        expect(mockOnDateChange).toHaveBeenCalledTimes(1);
    });

    it('should call onDateChange when clicking previous button', () => {
        const today = new Date();
        render(<DateCarousel selectedDate={today} onDateChange={mockOnDateChange} />);

        const prevButton = screen.getByLabelText(/previous day/i);
        fireEvent.click(prevButton);

        expect(mockOnDateChange).toHaveBeenCalledTimes(1);
    });

    it('should display formatted date for other dates', () => {
        const customDate = new Date('2026-01-15');
        render(<DateCarousel selectedDate={customDate} onDateChange={mockOnDateChange} />);

        // Should display weekday name — may be English or Spanish depending on i18n locale in tests
        const weekdayElement = screen.getByText(/monday|tuesday|wednesday|thursday|friday|saturday|sunday|lunes|martes|miércoles|miercoles|jueves|viernes|sábado|sabado|domingo/i);
        expect(weekdayElement).toBeInTheDocument();
    });
});
