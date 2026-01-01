import React from 'react';
import { Play, Pause, Square, Zap } from 'lucide-react';

interface FloatingControlsProps {
    timerActive: boolean;
    timeLeft: number;
    timerMode: 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK';
    pomodoroCount: number;
    setTimerActive: (active: boolean) => void;
    setTimerMode: (mode: 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK') => void;
    setTimeLeft: (time: number) => void;
}

export function FloatingControls({
    timerActive, timeLeft, timerMode, pomodoroCount,
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
                <div className={`glass-panel p-6 w-64 mb-2 shadow-2xl animate-scale-in border-l-4 skew-x-[-5deg] ${timerMode === 'FOCUS' ? 'border-l-cyber-pink shadow-neon-pink/20' :
                    timerMode === 'SHORT_BREAK' ? 'border-l-cyber-cyan shadow-neon-cyan/20' :
                        'border-l-cyber-yellow shadow-neon-yellow/20'
                    }`}>
                    <div className="skew-x-[5deg]">
                        <div className="flex justify-between items-center mb-2">
                            <div className={`text-[10px] font-cyber font-black tracking-[0.2em] uppercase ${timerMode === 'FOCUS' ? 'text-cyber-pink' :
                                timerMode === 'SHORT_BREAK' ? 'text-cyber-cyan' :
                                    'text-cyber-yellow'
                                }`}>
                                {timerMode.replace('_', ' ')} SEQUENCE
                            </div>
                            <div className="text-[10px] font-cyber font-black text-white/40">
                                {pomodoroCount}/4
                            </div>
                        </div>

                        {/* Pomodoro Progress Bits */}
                        <div className="flex gap-1.5 mb-4">
                            {[1, 2, 3, 4].map(i => (
                                <div
                                    key={i}
                                    className={`flex-1 h-1 transition-all duration-500 ${i < pomodoroCount ? 'bg-cyber-pink' :
                                        i === pomodoroCount ? (timerActive ? 'bg-cyber-pink animate-pulse' : 'bg-cyber-pink/30') :
                                            'bg-zinc-800'
                                        }`}
                                />
                            ))}
                        </div>

                        <div className="text-5xl font-mono font-bold text-white mb-6 tracking-tighter tabular-nums text-center drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                            {formatTime(timeLeft)}
                        </div>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setTimerActive(!timerActive)}
                                className={`w-12 h-12 flex items-center justify-center border-2 transition-all ${timerMode === 'FOCUS'
                                    ? 'bg-cyber-pink text-white border-cyber-pink shadow-neon-pink hover:bg-transparent hover:text-cyber-pink'
                                    : timerMode === 'SHORT_BREAK'
                                        ? 'bg-cyber-cyan text-black border-cyber-cyan shadow-neon-cyan hover:bg-transparent hover:text-cyber-cyan'
                                        : 'bg-cyber-yellow text-black border-cyber-yellow shadow-neon-yellow hover:bg-transparent hover:text-cyber-yellow'
                                    }`}
                            >
                                {timerActive ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                            </button>
                            <button
                                onClick={() => {
                                    setTimerActive(false);
                                    setTimeLeft(25 * 60);
                                    setTimerMode('FOCUS');
                                }}
                                className="w-12 h-12 flex items-center justify-center bg-transparent text-zinc-500 border-2 border-zinc-800 hover:border-white hover:text-white transition-all"
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

