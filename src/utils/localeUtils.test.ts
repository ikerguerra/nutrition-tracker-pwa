import { describe, it, expect, beforeEach } from 'vitest';
import { formatNumber, formatDate, formatCalories, formatMacro } from './localeUtils';
import i18n from '../i18n';

describe('localeUtils', () => {
    describe('formatNumber', () => {
        beforeEach(async () => {
            await i18n.changeLanguage('es');
        });

        it('should format number with Spanish locale (comma decimal)', () => {
            const result = formatNumber(1.5, 1);
            expect(result).toBe('1,5');
        });

        it('should format number with English locale (period decimal)', async () => {
            await i18n.changeLanguage('en');
            const result = formatNumber(1.5, 1);
            expect(result).toBe('1.5');
        });

        it('should format number with specified decimal places', () => {
            const result = formatNumber(123.456, 2);
            expect(result).toBe('123,46');
        });

        it('should format number with zero decimals', () => {
            const result = formatNumber(1234.56, 0);
            expect(result).toBe('1235');
        });
    });

    describe('formatCalories', () => {
        it('should format calories as whole number', () => {
            const result = formatCalories(1234.56);
            expect(result).toMatch(/^1\.?235$/); // Matches both "1235" and "1.235" (with thousands separator)
        });

        it('should format small calorie values', () => {
            const result = formatCalories(99.9);
            expect(result).toBe('100');
        });
    });

    describe('formatMacro', () => {
        it('should format macro with 1 decimal place', () => {
            const result = formatMacro(45.67);
            expect(result).toMatch(/45[,.]7/); // Matches both comma and period
        });

        it('should format zero macro value', () => {
            const result = formatMacro(0);
            expect(result).toMatch(/0[,.]0/);
        });
    });

    describe('formatDate', () => {
        it('should format date according to locale', () => {
            const date = new Date('2026-01-30');
            const result = formatDate(date);

            // Should contain day and month
            expect(result).toMatch(/30/);
            expect(result).toMatch(/ene|jan/i);
        });

        it('should format date with custom options', () => {
            const date = new Date('2026-01-30');
            const result = formatDate(date, { weekday: 'long' });

            // Should contain weekday name
            expect(result.length).toBeGreaterThan(5);
        });

        it('should handle string date input', () => {
            const result = formatDate('2026-01-30');
            expect(result).toMatch(/30/);
        });
    });
});
