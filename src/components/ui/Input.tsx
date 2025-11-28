import React, { InputHTMLAttributes, forwardRef } from 'react';
import './Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, icon, className = '', ...props }, ref) => {
        return (
            <div className="input-wrapper">
                {label && (
                    <label className="input-label" htmlFor={props.id}>
                        {label}
                    </label>
                )}
                <div className="input-container">
                    {icon && <div className="input-icon">{icon}</div>}
                    <input
                        ref={ref}
                        className={`input ${error ? 'input-error' : ''} ${icon ? 'input-with-icon' : ''} ${className}`}
                        {...props}
                    />
                </div>
                {error && <p className="input-error-text">{error}</p>}
                {helperText && !error && <p className="input-helper-text">{helperText}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';
