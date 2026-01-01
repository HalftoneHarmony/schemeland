import React from 'react';
import { Play, Pause, Square, Zap } from 'lucide-react';

interface FloatingControlsProps {
    timerActive: boolean;
    timeLeft: number;
    timerMode: 'FOCUS' | 'BREAK';
    setTimerActive: (active: boolean) => void;
    setTimerMode: (mode: 'FOCUS' | 'BREAK') => void;
    setTimeLeft: (time: number) => void;
}

export function FloatingControls({
    timerActive, timeLeft, timerMode,
    setTimerActive, setTimerMode, setTimeLeft
}: FloatingControlsProps) {

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4 pointer-events-auto">
            {/* Focus Timer */}
            {(timerActive || timeLeft !== 25 * 60) && (
                <div className="glass-panel p-6 w-64 mb-2 shadow-neon-pink/20 animate-scale-in border-l-4 border-l-cyber-pink skew-x-[-5deg]">
                    <div className="skew-x-[5deg]">
                        <div className="flex justify-between items-center mb-4">
                            <div className="text-[10px] font-cyber font-black text-cyber-pink tracking-[0.2em] uppercase">{timerMode} SEQUENCE</div>
                            <div className="flex gap-1">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className={`w-1 h-3 ${timerActive ? 'bg-cyber-pink animate-pulse' : 'bg-zinc-800'}`} style={{ animationDelay: `${i * 0.2}s` }} />
                                ))}
                            </div>
                        </div>
                        <div className="text-5xl font-mono font-bold text-white mb-6 tracking-tighter tabular-nums text-center drop-shadow-[0_0_10px_rgba(255,0,255,0.5)]">
                            {formatTime(timeLeft)}
                        </div>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setTimerActive(!timerActive)}
                                className="w-12 h-12 flex items-center justify-center bg-cyber-pink text-white hover:bg-transparent hover:text-cyber-pink border-2 border-cyber-pink transition-all shadow-neon-pink"
                            >
                                {timerActive ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                            </button>
                            <button
                                onClick={() => { setTimerActive(false); setTimeLeft(25 * 60); setTimerMode('FOCUS'); }}
                                className="w-12 h-12 flex items-center justify-center bg-transparent text-zinc-500 border-2 border-zinc-800 hover:border-cyber-cyan hover:text-cyber-cyan transition-all"
                            >
                                <Square size={18} fill="currentColor" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {!timerActive && timeLeft === 25 * 60 && (
                <button
                    onClick={() => setTimerActive(true)}
                    className="w-16 h-16 bg-black border-2 border-cyber-yellow text-cyber-yellow flex items-center justify-center shadow-neon-yellow hover:scale-110 transition-all group relative skew-x-[-10deg]"
                >
                    <div className="skew-x-[10deg]">
                        <Zap size={28} fill="currentColor" className="group-hover:animate-glitch" />
                    </div>
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyber-yellow animate-ping rounded-full"></span>
                </button>
            )}
        </div>
    );
}

