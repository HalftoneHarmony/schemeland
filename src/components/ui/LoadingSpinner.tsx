/**
 * @file components/ui/LoadingSpinner.tsx
 * 로딩 스피너 컴포넌트
 */

import React from 'react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    color?: 'pink' | 'white' | 'zinc';
}

const sizeStyles: Record<string, string> = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
};

const colorStyles: Record<string, string> = {
    pink: 'border-cyber-pink/30 border-t-cyber-pink',
    white: 'border-white/30 border-t-white',
    zinc: 'border-zinc-600 border-t-zinc-300',
};

export function LoadingSpinner({
    size = 'md',
    className = '',
    color = 'pink',
}: LoadingSpinnerProps) {
    return (
        <div
            className={`animate-spin rounded-full ${sizeStyles[size]} ${colorStyles[color]} ${className}`}
        />
    );
}

export default LoadingSpinner;
