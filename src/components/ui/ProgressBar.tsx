/**
 * @file components/ui/ProgressBar.tsx
 * 진행률 바 컴포넌트
 */

import React from 'react';

interface ProgressBarProps {
    value: number;  // 0-100
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'gradient' | 'cyber';
    showLabel?: boolean;
    className?: string;
}

const sizeStyles: Record<string, string> = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
};

const barStyles: Record<string, string> = {
    default: 'bg-cyber-pink',
    gradient: 'bg-gradient-to-r from-cyber-pink to-fuchsia-500',
    cyber: 'bg-gradient-to-r from-cyber-pink via-fuchsia-500 to-violet-500',
};

export function ProgressBar({
    value,
    size = 'md',
    variant = 'default',
    showLabel = false,
    className = '',
}: ProgressBarProps) {
    const clampedValue = Math.min(100, Math.max(0, value));

    return (
        <div className={`w-full ${className}`}>
            {showLabel && (
                <div className="flex justify-between mb-1 text-xs text-zinc-400">
                    <span>Progress</span>
                    <span>{Math.round(clampedValue)}%</span>
                </div>
            )}
            <div className={`w-full bg-zinc-800 rounded-full overflow-hidden ${sizeStyles[size]}`}>
                <div
                    className={`${sizeStyles[size]} ${barStyles[variant]} rounded-full transition-all duration-500 ease-out`}
                    style={{ width: `${clampedValue}%` }}
                />
            </div>
        </div>
    );
}

export default ProgressBar;
