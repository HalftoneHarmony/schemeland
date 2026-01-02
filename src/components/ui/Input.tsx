/**
 * @file components/ui/Input.tsx
 * 재사용 가능한 입력 컴포넌트
 */

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    variant?: 'default' | 'cyber';
    className?: string;
}


export function Input({
    label,
    error,
    variant = 'default',
    className = '',
    ...props
}: InputProps) {
    const baseStyles = 'w-full px-4 py-3 rounded-lg bg-zinc-800/50 border text-white placeholder-zinc-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyber-pink/50';

    const variantStyles = variant === 'cyber'
        ? 'border-cyber-pink/30 focus:border-cyber-pink'
        : 'border-zinc-700 focus:border-cyber-pink/50';

    const errorStyles = error ? 'border-red-500 focus:ring-red-500/50' : '';

    return (
        <div className="space-y-1.5">
            {label && (
                <label className="block text-sm font-medium text-zinc-400">
                    {label}
                </label>
            )}
            <input
                className={`${baseStyles} ${variantStyles} ${errorStyles} ${className}`}
                {...props}
            />
            {error && (
                <p className="text-sm text-red-400">{error}</p>
            )}
        </div>
    );
}

export default Input;
