/**
 * @file components/ui/Card.tsx
 * 재사용 가능한 카드 컴포넌트
 */

import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'cyber' | 'glass' | 'neon';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    onClick?: () => void;
    hoverable?: boolean;
}

const variantStyles: Record<string, string> = {
    default: 'bg-surface border border-cyber-pink/10',
    cyber: 'bg-gradient-to-br from-surface to-zinc-900/50 border border-cyber-pink/20 shadow-neon-pink',
    glass: 'bg-white/5 backdrop-blur-xl border border-white/10',
    neon: 'bg-surface border-2 border-cyber-pink shadow-neon-pink',
};

const paddingStyles: Record<string, string> = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
};

export function Card({
    children,
    className = '',
    variant = 'default',
    padding = 'md',
    onClick,
    hoverable = false,
}: CardProps) {
    const baseStyles = 'rounded-xl transition-all duration-300';
    const hoverStyles = hoverable ? 'hover:border-cyber-pink/40 hover:shadow-lg hover:-translate-y-1 cursor-pointer' : '';
    const clickableStyles = onClick ? 'cursor-pointer' : '';

    return (
        <div
            className={`${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${hoverStyles} ${clickableStyles} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
}

export default Card;
