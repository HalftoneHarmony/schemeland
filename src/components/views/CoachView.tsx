import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, Terminal, Dumbbell, Zap, Skull } from 'lucide-react';
import { useStore } from '../../store';
import { CoachType, ChatMessage } from '../../types';
import { chatWithCoach } from '../../services/coachService';

interface CoachViewProps {
    onBack: () => void;
}

export const CoachView: React.FC<CoachViewProps> = ({ onBack }) => {
    const store = useStore();
    const activeProjectId = store.activeProjectId;
    const activeProject = activeProjectId ? store.projects[activeProjectId] : undefined;
    const currentIdea = activeProject ? store.ideas[activeProject.ideaId] : undefined;

    const [coachType, setCoachType] = useState<CoachType>(CoachType.ELON);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Initial greeting
    useEffect(() => {
        if (messages.length === 0) {
            const greeting = coachType === CoachType.ELON
                ? "First principles. What is the fundamental problem we are keeping existing today? Speak."
                : "WHO'S GONNA CARRY THE BOATS?! I don't care how you feel. TELL ME WHAT YOU DID TODAY.";

            setMessages([{
                id: 'init',
                sender: 'ai',
                text: greeting,
                coachType,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                timestamp: new Date().toISOString()
            }]);
        }
    }, [coachType]);

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            sender: 'user',
            text: inputValue,
            coachType,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            timestamp: new Date().toISOString() // Compatibility
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        try {
            const responseText = await chatWithCoach(
                inputValue,
                coachType,
                { project: activeProject, currentIdea }
            );

            const aiMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                sender: 'ai',
                text: responseText,
                coachType,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error("Coach error", error);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const toggleCoach = (type: CoachType) => {
        if (type !== coachType) {
            setCoachType(type);
            setMessages([]); // Clear chat on switch or maybe keep history? Clearing for now.
        }
    };

    // Styles based on coach
    const isElon = coachType === CoachType.ELON;
    const accentColor = isElon ? 'border-cyber-cyan text-cyber-cyan' : 'border-red-500 text-red-500';
    const bgGlow = isElon ? 'shadow-neon-cyan' : 'shadow-[0_0_20px_rgba(239,68,68,0.3)]';
    const buttonClass = isElon
        ? 'bg-cyber-cyan/10 hover:bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan'
        : 'bg-red-900/10 hover:bg-red-900/20 border-red-500 text-red-500';

    return (
        <div className="h-full flex flex-col relative overflow-hidden bg-zinc-950/80 backdrop-blur-md">
            {/* Background Atmosphere & Grid */}
            <div className={`absolute inset-0 pointer-events-none opacity-20 ${isElon ? 'bg-cyber-cyan/5' : 'bg-red-900/10'}`}>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)]" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5 relative z-10 bg-zinc-900/40 mb-4 mx-4 mt-4 cyber-clipper-lg">
                <div className="flex items-center gap-4">
                    <div className="flex gap-4">
                        <button
                            onClick={() => toggleCoach(CoachType.ELON)}
                            className={`p-4 border transition-all duration-300 relative group overflow-hidden cyber-clipper ${coachType === CoachType.ELON ? 'bg-cyber-cyan/10 border-cyber-cyan text-cyber-cyan shadow-neon-cyan' : 'border-white/10 text-gray-500 hover:bg-white/5 hover:text-white'}`}
                        >
                            <div className={`absolute inset-0 bg-cyber-cyan/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ${coachType === CoachType.ELON ? 'opacity-20' : ''}`} />
                            <div className="flex flex-col items-center relative z-10">
                                <Zap size={20} className={coachType === CoachType.ELON ? 'animate-pulse' : ''} />
                                <span className="text-[9px] font-cyber font-black mt-2 tracking-widest">ELON_MUSK</span>
                            </div>
                        </button>
                        <button
                            onClick={() => toggleCoach(CoachType.GOGGINS)}
                            className={`p-4 border transition-all duration-300 relative group overflow-hidden cyber-clipper ${coachType === CoachType.GOGGINS ? 'bg-red-500/10 border-red-500 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'border-white/10 text-gray-500 hover:bg-white/5 hover:text-white'}`}
                        >
                            <div className={`absolute inset-0 bg-red-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ${coachType === CoachType.GOGGINS ? 'opacity-20' : ''}`} />
                            <div className="flex flex-col items-center relative z-10">
                                <Skull size={20} className={coachType === CoachType.GOGGINS ? 'animate-pulse' : ''} />
                                <span className="text-[9px] font-cyber font-black mt-2 tracking-widest">DAVID_GOGGINS</span>
                            </div>
                        </button>
                    </div>

                    <div className="h-10 w-[1px] bg-white/10 mx-2" />

                    <div>
                        <h2 className={`font-cyber text-2xl font-black italic uppercase tracking-wider ${accentColor} flex items-center gap-2`}>
                            {isElon ? (
                                <>
                                    <Terminal size={24} />
                                    <span>TECHNOKING</span>
                                </>
                            ) : (
                                <>
                                    <Dumbbell size={24} />
                                    <span>DRILL INSTRUCTOR</span>
                                </>
                            )}
                        </h2>
                        <p className="text-white/40 text-sm font-mono flex items-center gap-2">
                            {isElon ? "Targeting Mars. Optimizing constraints." : "Stay Hard. Taking Souls."}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Project Context Indicator */}
                    {activeProject && (
                        <div className="hidden md:flex flex-col items-end opacity-60">
                            <span className="text-[9px] uppercase tracking-widest text-cyber-cyan/70 font-cyber font-black">Current_Mission_Lock</span>
                            <span className="text-sm font-bold text-white max-w-[200px] truncate font-mono bg-white/5 px-2 py-1 rounded-none cyber-clipper">{currentIdea?.title || 'Unknown'}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 relative z-10 scrollbar-hide">
                {messages.map((msg) => {
                    const isAi = msg.sender === 'ai';
                    return (
                        <div
                            key={msg.id}
                            className={`flex ${isAi ? 'justify-start' : 'justify-end'} animate-fade-in-up`}
                        >
                            <div className={`max-w-[80%] md:max-w-[70%] flex gap-4 ${isAi ? 'flex-row' : 'flex-row-reverse'}`}>
                                {/* Avatar */}
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border 
                                    ${isAi
                                        ? (isElon ? 'bg-black border-cyber-cyan text-cyber-cyan' : 'bg-black border-red-500 text-red-500')
                                        : 'bg-white/10 border-white/20 text-white'}`}
                                >
                                    {isAi ? (isElon ? <Bot size={20} /> : <Skull size={20} />) : <User size={20} />}
                                </div>

                                {/* Message Bubble */}
                                <div className={`flex flex-col ${isAi ? 'items-start' : 'items-end'}`}>
                                    <div className={`p-5 border backdrop-blur-md relative overflow-hidden group cyber-clipper
                                        ${isAi
                                            ? (isElon ? 'bg-cyber-cyan/5 border-cyber-cyan/30 text-cyber-cyan' : 'bg-red-500/5 border-red-500/30 text-red-100')
                                            : 'bg-white/5 border-white/10 text-white'
                                        }
                                    `}>
                                        {/* Glitch Effect on Hover for Elon */}
                                        {isAi && isElon && (
                                            <div className="absolute inset-0 bg-cyber-cyan/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500 animate-pulse" />
                                        )}

                                        <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                                    </div>
                                    <span className="text-[10px] text-white/20 mt-1 font-mono px-2">
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {isTyping && (
                    <div className="flex justify-start animate-fade-in">
                        <div className="flex gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border bg-black ${isElon ? 'border-cyber-cyan text-cyber-cyan' : 'border-red-500 text-red-500'}`}>
                                <Sparkles size={16} className="animate-spin-slow" />
                            </div>
                            <div className={`p-4 border flex items-center gap-2 cyber-clipper ${isElon ? 'bg-cyber-cyan/5 border-cyber-cyan/20' : 'bg-red-500/5 border-red-500/20'}`}>
                                <div className={`w-1.5 h-1.5 rounded-none animate-pulse ${isElon ? 'bg-cyber-cyan' : 'bg-red-500'}`} style={{ animationDelay: '0s' }} />
                                <div className={`w-1.5 h-1.5 rounded-none animate-pulse ${isElon ? 'bg-cyber-cyan' : 'bg-red-500'}`} style={{ animationDelay: '0.2s' }} />
                                <div className={`w-1.5 h-1.5 rounded-none animate-pulse ${isElon ? 'bg-cyber-cyan' : 'bg-red-500'}`} style={{ animationDelay: '0.4s' }} />
                                <span className="text-[10px] uppercase tracking-widest opacity-70 ml-2 font-cyber font-black">
                                    {isElon ? 'NEURAL_PROCESSING...' : 'GRINDING_DATA...'}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 relative z-20">
                <div className={`p-1 border transition-all duration-300 flex gap-2 items-center cyber-clipper bg-black/40 ${isElon ? 'border-cyber-cyan/50 shadow-[0_0_30px_rgba(0,255,255,0.1)]' : 'border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.1)]'}`}>
                    <div className="flex-1 flex items-center">
                        <span className={`pl-4 font-cyber font-black text-xs ${isElon ? 'text-cyber-cyan' : 'text-red-500'}`}>{'>'}</span>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={isElon ? "Identify constraints or input data..." : "DON'T BE WEAK. REPORT IN."}
                            className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/20 px-4 py-4 font-mono text-sm"
                            autoFocus
                        />
                    </div>
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isTyping}
                        className={`p-4 transition-all duration-200 cyber-clipper
                            ${!inputValue.trim() || isTyping
                                ? 'opacity-30 cursor-not-allowed bg-white/5 text-white'
                                : isElon
                                    ? 'bg-cyber-cyan text-black hover:bg-white hover:shadow-neon-white'
                                    : 'bg-red-600 text-black hover:bg-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.6)]'
                            }`}
                    >
                        <Send size={18} fill="currentColor" />
                    </button>
                </div>
                <div className="text-center mt-2">
                    <span className="text-[10px] text-white/20 uppercase tracking-widest">
                        Values provided by AI Model • Verify critical information
                    </span>
                </div>
            </div>
        </div>
    );
};
