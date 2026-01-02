import React, { useState } from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  isLoading,
  disabled,
  onClick,
  ...props
}) => {
  const [rippleStyle, setRippleStyle] = useState<{ left: number; top: number } | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Create ripple effect
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRippleStyle({ left: x, top: y });

    // Clear ripple after animation
    setTimeout(() => setRippleStyle(null), 600);

    // Call original onClick
    if (onClick) onClick(e);
  };

  const baseStyles = "inline-flex items-center justify-center font-cyber font-black tracking-[0.2em] uppercase transition-all duration-300 focus:outline-none disabled:opacity-40 disabled:grayscale disabled:pointer-events-none relative overflow-hidden active:scale-95 skew-x-[-10deg] group";

  const variants = {
    primary: "bg-cyber-pink text-white border-2 border-cyber-pink shadow-neon-pink hover:bg-transparent hover:text-cyber-pink hover:shadow-[0_0_30px_rgba(255,0,255,0.6)]",
    secondary: "bg-transparent text-cyber-cyan border-2 border-cyber-cyan shadow-neon-cyan hover:bg-cyber-cyan hover:text-black hover:shadow-[0_0_30px_rgba(0,255,255,0.6)]",
    accent: "bg-cyber-yellow text-black border-2 border-cyber-yellow shadow-neon-yellow hover:bg-transparent hover:text-cyber-yellow hover:shadow-[0_0_30px_rgba(252,238,10,0.6)]",
    danger: "bg-transparent text-red-500 border-2 border-red-500 hover:bg-red-500 hover:text-white hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]",
    ghost: "text-white/40 border border-white/5 hover:border-white/30 hover:text-white hover:bg-white/5",
  };

  const sizes = {
    sm: "px-4 py-2 text-[9px]",
    md: "px-8 py-3 text-[11px]",
    lg: "px-10 py-4 text-xs",
  };

  return (
    <button
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      onClick={handleClick}
      {...props}
    >
      <div className="skew-x-[10deg] flex items-center justify-center relative z-10 transition-transform duration-200 group-hover:scale-105">
        {isLoading && <Loader2 className={clsx("animate-spin", size === 'sm' ? "mr-1.5 h-3 w-3" : "mr-2 h-4 w-4")} />}
        {children}
      </div>

      {/* Gloss Sweep Effect on Hover */}
      <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[15deg] transition-all duration-700 group-hover:left-[100%]" />

      {/* Ripple Effect */}
      {rippleStyle && (
        <span
          className="absolute rounded-full bg-white/30 animate-ping pointer-events-none"
          style={{
            left: rippleStyle.left - 10,
            top: rippleStyle.top - 10,
            width: '20px',
            height: '20px',
          }}
        />
      )}

      {/* Corner Decor with pulse on hover */}
      <div className="absolute top-0 right-0 w-1 h-1 bg-white opacity-40 group-hover:opacity-100 group-hover:animate-pulse transition-opacity" />
      <div className="absolute bottom-0 left-0 w-1 h-1 bg-white opacity-40 group-hover:opacity-100 group-hover:animate-pulse transition-opacity" />

      {/* Border glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none border border-white/20" />
    </button>
  );
};

export default Button;