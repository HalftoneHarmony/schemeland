import React from 'react';
import { Play, Pause, Square, Zap, Edit3, Save, X } from 'lucide-react';

interface FloatingControlsProps {
    timerActive: boolean;
    timeLeft: number;
    timerMode: 'FOCUS' | 'BREAK';
    isEditingMode: boolean;
    setTimerActive: (active: boolean) => void;
    setTimerMode: (mode: 'FOCUS' | 'BREAK') => void;
    setTimeLeft: (time: number) => void;
    setIsEditingMode: (edit: boolean) => void;
}

export function FloatingControls({
    timerActive, timeLeft, timerMode, isEditingMode,
    setTimerActive, setTimerMode, setTimeLeft, setIsEditingMode
}: FloatingControlsProps) {

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3 pointer-events-auto">
            {/* Global Edit Toggle */}
            <button
                onClick={() => setIsEditingMode(!isEditingMode)}
                className={`p-4 rounded-full shadow-[0_0_20px_-5px_rgba(0,0,0,0.5)] transition-all hover:scale-110 mb-2
                    ${isEditingMode
                        ? 'bg-primary text-white ring-2 ring-white border-2 border-primary'
                        : 'bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700'
                    }
                `}
                title={isEditingMode ? "Done Editing" : "Enter Layout Edit Mode"}
            >
                {isEditingMode ? <Save size={24} /> : <Edit3 size={24} />}
            </button>

            {/* Focus Timer */}
            {timerActive || timeLeft !== 25 * 60 ? (
                <div className="glass-panel p-6 rounded-2xl w-56 mb-2 shadow-[0_0_30px_-10px_rgba(0,0,0,0.5)] animate-scale-in border-t-2 border-t-primary">
                    <div className="text-center">
                        <div className="text-[10px] font-black text-primary mb-2 tracking-[0.2em] uppercase">{timerMode} SEQUENCE</div>
                        <div className="text-5xl font-mono font-bold text-white mb-4 tracking-tighter tabular-nums">{formatTime(timeLeft)}</div>
                        <div className="flex justify-center gap-3">
                            <button onClick={() => setTimerActive(!timerActive)} className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white hover:bg-primaryHover transition-colors shadow-lg shadow-primary/30">
                                {timerActive ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
                            </button>
                            <button onClick={() => { setTimerActive(false); setTimeLeft(25 * 60); setTimerMode('FOCUS'); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-800 text-zinc-400 hover:bg-zinc-700 transition-colors">
                                <Square size={16} fill="currentColor" />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <button onClick={() => setTimerActive(true)} className="bg-zinc-900 text-yellow-500 p-4 rounded-full shadow-[0_0_20px_-5px_rgba(234,179,8,0.4)] hover:bg-zinc-800 transition-all hover:scale-110 group relative border border-yellow-500/20">
                    <span className="absolute inset-0 rounded-full bg-yellow-500 animate-ping opacity-10"></span>
                    <Zap size={28} className="relative z-10" fill="currentColor" />
                </button>
            )}
        </div>
    );
}
