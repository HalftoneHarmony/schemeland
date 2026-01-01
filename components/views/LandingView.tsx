import React from 'react';
import { BrainCircuit, ChevronRight, Sparkles, Scroll, Trophy } from 'lucide-react';

interface LandingViewProps {
  onStart: () => void;
  onLoadSave: () => void;
  hasProjects: boolean;
}

export function LandingView({ onStart, onLoadSave, hasProjects }: LandingViewProps) {
  return (
    <div className="flex flex-col items-center min-h-[90vh] text-center px-4 relative overflow-hidden">
        {/* Hero Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-float -z-10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px] animate-float -z-10" style={{ animationDelay: '2s' }}></div>

        <div className="mt-20 md:mt-32 max-w-5xl mx-auto z-10 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/50 border border-zinc-800 backdrop-blur text-sm text-primary font-medium mb-8">
                <Sparkles size={16} /> AI-Powered Project Manager
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-zinc-500 leading-[1.1]">
                TURN IDEAS INTO <br/>
                <span className="text-glow text-primary">REALITY</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-textMuted mb-12 max-w-2xl mx-auto leading-relaxed">
                SchemeLand gamifies your side projects. <br/>
                From chaotic ideas to a concrete <span className="text-white font-bold">Level 100</span> product launch.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button 
                    onClick={onStart} 
                    className="group relative px-8 py-5 bg-white text-black font-bold text-lg rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)]"
                >
                    <span className="relative z-10 flex items-center gap-2">START NEW GAME <ChevronRight className="group-hover:translate-x-1 transition-transform"/></span>
                </button>
                {hasProjects && (
                     <button 
                        onClick={onLoadSave} 
                        className="px-8 py-5 bg-zinc-900 border border-zinc-800 text-white font-bold text-lg rounded-full hover:bg-zinc-800 transition-all hover:border-primary/50"
                    >
                        LOAD SAVE
                    </button>
                )}
            </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-32 w-full animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {[
                { icon: <BrainCircuit size={32} className="text-primary"/>, title: "AI Analysis", desc: "Evaluate feasibility and market potential instantly." },
                { icon: <Scroll size={32} className="text-accent"/>, title: "Quest Generation", desc: "Turn vague goals into actionable weekly quests." },
                { icon: <Trophy size={32} className="text-yellow-500"/>, title: "Gamified Progress", desc: "Earn XP as you complete tasks and ship features." }
            ].map((feature, idx) => (
                <div key={idx} className="glass-panel p-8 rounded-2xl flex flex-col items-center text-center hover:border-primary/30 transition-all group">
                    <div className="bg-zinc-900/50 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform ring-1 ring-white/5">{feature.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-textMuted">{feature.desc}</p>
                </div>
            ))}
        </div>
    </div>
  );
}
