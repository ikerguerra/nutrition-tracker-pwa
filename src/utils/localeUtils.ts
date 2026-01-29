import i18n from '../i18n';

/**
 * Format a date according to the current locale
 */
export const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const locale = i18n.language || 'es';

    const defaultOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        ...options,
    };

    return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
};

/**
 * Format a date in short format (e.g., "30/01/2026" for es, "01/30/2026" for en)
 */
export const formatDateShort = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const locale = i18n.language || 'es';

    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(dateObj);
};

/**
 * Format a number according to the current locale
 */
export const formatNumber = (
    num: number | string,
    decimals: number = 1,
    options?: Intl.NumberFormatOptions
): string => {
    const numValue = typeof num === 'string' ? parseFloat(num) : num;
    const locale = i18n.language || 'es';

    const defaultOptions: Intl.NumberFormatOptions = {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        ...options,
    };

    return new Intl.NumberFormat(locale, defaultOptions).format(numValue);
};

/**
 * Format a number as a percentage
 */
export const formatPercentage = (num: number, decimals: number = 0): string => {
    const locale = i18n.language || 'es';

    return new Intl.NumberFormat(locale, {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(num / 100);
};

/**
 * Format weight with unit (kg or lb based on user preference)
 */
export const formatWeight = (weight: number, unit: 'kg' | 'lb' = 'kg'): string => {
    return `${formatNumber(weight, 1)} ${unit}`;
};

/**
 * Format calories (always whole number)
 */
export const formatCalories = (calories: number): string => {
    return formatNumber(calories, 0);
};

/**
 * Format macros (protein, carbs, fats) with 1 decimal
 */
export const formatMacro = (value: number): string => {
    return formatNumber(value, 1);
};
