import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, Terminal, Dumbbell, Zap, Skull, Trophy, ImagePlus, X, Loader2 } from 'lucide-react';
import { useStore } from '../../store';
import { CoachType, ChatMessage } from '../../types';
import { chatWithCoach } from '../../services/coachService';
import { uploadImage } from '../../utils/imageUtils';

// localStorage 키 상수
const COACH_AVATAR_STORAGE_KEY = 'schemeland_coach_avatars';

// 코치 아바타 저장/불러오기 헬퍼
const getCoachAvatars = (): Record<CoachType, string | null> => {
    try {
        const stored = localStorage.getItem(COACH_AVATAR_STORAGE_KEY);
        if (stored) return JSON.parse(stored);
    } catch (e) {
        console.error('코치 아바타 로드 실패:', e);
    }
    return { [CoachType.ELON]: null, [CoachType.GOGGINS]: null, [CoachType.CBUM]: null };
};

const saveCoachAvatar = (type: CoachType, imageData: string | null) => {
    const avatars = getCoachAvatars();
    avatars[type] = imageData;
    localStorage.setItem(COACH_AVATAR_STORAGE_KEY, JSON.stringify(avatars));
};

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

    // 커스텀 아바타 상태
    const [coachAvatars, setCoachAvatars] = useState<Record<CoachType, string | null>>(getCoachAvatars);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

    // 현재 코치의 커스텀 아바타
    const currentCoachAvatar = coachAvatars[coachType];

    // 아바타 업로드 핸들러
    const handleAvatarUpload = async () => {
        setIsUploadingAvatar(true);
        try {
            const result = await uploadImage();
            if (result) {
                saveCoachAvatar(coachType, result.base64);
                setCoachAvatars(getCoachAvatars());
            }
        } catch (error) {
            console.error('아바타 업로드 실패:', error);
            alert(error instanceof Error ? error.message : '아바타 업로드에 실패했습니다.');
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    // 아바타 삭제 핸들러
    const handleAvatarRemove = () => {
        saveCoachAvatar(coachType, null);
        setCoachAvatars(getCoachAvatars());
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Initial greeting
    useEffect(() => {
        if (messages.length === 0) {
            const getGreeting = () => {
                switch (coachType) {
                    case CoachType.ELON:
                        return "제1원리로 생각해보자. 지금 진짜 해결해야 할 근본적인 문제가 뭐야? 말해봐.";
                    case CoachType.GOGGINS:
                        return "WHO'S GONNA CARRY THE BOATS?! 오늘 뭘 했는지 보고해. 변명 말고.";
                    case CoachType.CBUM:
                        return "야, 반가워. 형이 20살 때도 존나 방황했어. 근데 지금 여기 있잖아. 너도 할 수 있어. 뭐 고민 있어? 말해봐. 💪";
                    default:
                        return "얘기해보자.";
                }
            };
            const greeting = getGreeting();

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
        // 한국어 IME 조합 중에는 Enter를 무시 (중복 전송 방지)
        if (e.nativeEvent.isComposing) return;

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
    const isGoggins = coachType === CoachType.GOGGINS;
    const isCbum = coachType === CoachType.CBUM;

    const getAccentColor = () => {
        switch (coachType) {
            case CoachType.ELON: return 'border-cyber-cyan text-cyber-cyan';
            case CoachType.GOGGINS: return 'border-red-500 text-red-500';
            case CoachType.CBUM: return 'border-amber-400 text-amber-400';
            default: return 'border-white text-white';
        }
    };

    const getBgColor = () => {
        switch (coachType) {
            case CoachType.ELON: return 'bg-cyber-cyan/5';
            case CoachType.GOGGINS: return 'bg-red-900/10';
            case CoachType.CBUM: return 'bg-amber-400/5';
            default: return 'bg-white/5';
        }
    };

    const accentColor = getAccentColor();

    return (
        <div className="h-full flex flex-col relative overflow-hidden bg-zinc-950/80 backdrop-blur-md">
            {/* Background Atmosphere & Grid */}
            <div className={`absolute inset-0 pointer-events-none opacity-20 ${getBgColor()}`}>
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
                                {coachAvatars[CoachType.ELON] ? (
                                    <img src={coachAvatars[CoachType.ELON]!} alt="Elon" className="w-6 h-6 rounded-full object-cover" />
                                ) : (
                                    <Zap size={20} className={coachType === CoachType.ELON ? 'animate-pulse' : ''} />
                                )}
                                <span className="text-[9px] font-cyber font-black mt-2 tracking-widest">ELON_MUSK</span>
                            </div>
                        </button>
                        <button
                            onClick={() => toggleCoach(CoachType.GOGGINS)}
                            className={`p-4 border transition-all duration-300 relative group overflow-hidden cyber-clipper ${coachType === CoachType.GOGGINS ? 'bg-red-500/10 border-red-500 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'border-white/10 text-gray-500 hover:bg-white/5 hover:text-white'}`}
                        >
                            <div className={`absolute inset-0 bg-red-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ${coachType === CoachType.GOGGINS ? 'opacity-20' : ''}`} />
                            <div className="flex flex-col items-center relative z-10">
                                {coachAvatars[CoachType.GOGGINS] ? (
                                    <img src={coachAvatars[CoachType.GOGGINS]!} alt="Goggins" className="w-6 h-6 rounded-full object-cover" />
                                ) : (
                                    <Skull size={20} className={coachType === CoachType.GOGGINS ? 'animate-pulse' : ''} />
                                )}
                                <span className="text-[9px] font-cyber font-black mt-2 tracking-widest">DAVID_GOGGINS</span>
                            </div>
                        </button>
                        <button
                            onClick={() => toggleCoach(CoachType.CBUM)}
                            className={`p-4 border transition-all duration-300 relative group overflow-hidden cyber-clipper ${coachType === CoachType.CBUM ? 'bg-amber-400/10 border-amber-400 text-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.4)]' : 'border-white/10 text-gray-500 hover:bg-white/5 hover:text-white'}`}
                        >
                            <div className={`absolute inset-0 bg-amber-400/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ${coachType === CoachType.CBUM ? 'opacity-20' : ''}`} />
                            <div className="flex flex-col items-center relative z-10">
                                {coachAvatars[CoachType.CBUM] ? (
                                    <img src={coachAvatars[CoachType.CBUM]!} alt="Cbum" className="w-6 h-6 rounded-full object-cover" />
                                ) : (
                                    <Trophy size={20} className={coachType === CoachType.CBUM ? 'animate-pulse' : ''} />
                                )}
                                <span className="text-[9px] font-cyber font-black mt-2 tracking-widest">CHRIS_BUMSTEAD</span>
                            </div>
                        </button>
                    </div>

                    {/* Avatar Upload Button */}
                    <div className="flex gap-2 ml-2">
                        {currentCoachAvatar && (
                            <button
                                onClick={handleAvatarRemove}
                                className="p-2 bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 transition-all cyber-clipper"
                                title="아바타 삭제"
                            >
                                <X size={14} />
                            </button>
                        )}
                        <button
                            onClick={handleAvatarUpload}
                            disabled={isUploadingAvatar}
                            className={`p-2 border transition-all cyber-clipper flex items-center gap-1 ${isElon ? 'border-cyber-cyan/50 text-cyber-cyan hover:bg-cyber-cyan/10' : isGoggins ? 'border-red-500/50 text-red-400 hover:bg-red-500/10' : 'border-amber-400/50 text-amber-400 hover:bg-amber-400/10'} disabled:opacity-50`}
                            title="코치 아바타 업로드"
                        >
                            {isUploadingAvatar ? (
                                <Loader2 size={14} className="animate-spin" />
                            ) : (
                                <ImagePlus size={14} />
                            )}
                        </button>
                    </div>

                    <div className="h-10 w-[1px] bg-white/10 mx-2" />

                    <div>
                        <h2 className={`font-cyber text-2xl font-black italic uppercase tracking-wider ${accentColor} flex items-center gap-2`}>
                            {isElon && (
                                <>
                                    <Terminal size={24} />
                                    <span>TECHNOKING</span>
                                </>
                            )}
                            {isGoggins && (
                                <>
                                    <Dumbbell size={24} />
                                    <span>DRILL INSTRUCTOR</span>
                                </>
                            )}
                            {isCbum && (
                                <>
                                    <Trophy size={24} />
                                    <span>CLASSIC PHYSIQUE</span>
                                </>
                            )}
                        </h2>
                        <p className="text-white/40 text-sm font-mono flex items-center gap-2">
                            {isElon && "제1원리 사고. 근본부터 다시 생각하자."}
                            {isGoggins && "STAY HARD. 한계를 넘어서."}
                            {isCbum && "시작해. 엉망이어도 괜찮아. Let's go."}
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
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border overflow-hidden
                                    ${isAi
                                        ? (isElon ? 'bg-black border-cyber-cyan text-cyber-cyan'
                                            : isGoggins ? 'bg-black border-red-500 text-red-500'
                                                : 'bg-black border-amber-400 text-amber-400')
                                        : 'bg-white/10 border-white/20 text-white'}`}
                                >
                                    {isAi ? (
                                        currentCoachAvatar ? (
                                            <img src={currentCoachAvatar} alt="Coach" className="w-full h-full object-cover" />
                                        ) : (
                                            isElon ? <Bot size={20} />
                                                : isGoggins ? <Skull size={20} />
                                                    : <Trophy size={20} />
                                        )
                                    ) : <User size={20} />}
                                </div>

                                {/* Message Bubble */}
                                <div className={`flex flex-col ${isAi ? 'items-start' : 'items-end'}`}>
                                    <div className={`p-5 border backdrop-blur-md relative overflow-hidden group cyber-clipper
                                        ${isAi
                                            ? (isElon ? 'bg-cyber-cyan/5 border-cyber-cyan/30 text-cyber-cyan'
                                                : isGoggins ? 'bg-red-500/5 border-red-500/30 text-red-100'
                                                    : 'bg-amber-400/5 border-amber-400/30 text-amber-100')
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
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border bg-black ${isElon ? 'border-cyber-cyan text-cyber-cyan' : isGoggins ? 'border-red-500 text-red-500' : 'border-amber-400 text-amber-400'}`}>
                                <Sparkles size={16} className="animate-spin-slow" />
                            </div>
                            <div className={`p-4 border flex items-center gap-2 cyber-clipper ${isElon ? 'bg-cyber-cyan/5 border-cyber-cyan/20' : isGoggins ? 'bg-red-500/5 border-red-500/20' : 'bg-amber-400/5 border-amber-400/20'}`}>
                                <div className={`w-1.5 h-1.5 rounded-none animate-pulse ${isElon ? 'bg-cyber-cyan' : isGoggins ? 'bg-red-500' : 'bg-amber-400'}`} style={{ animationDelay: '0s' }} />
                                <div className={`w-1.5 h-1.5 rounded-none animate-pulse ${isElon ? 'bg-cyber-cyan' : isGoggins ? 'bg-red-500' : 'bg-amber-400'}`} style={{ animationDelay: '0.2s' }} />
                                <div className={`w-1.5 h-1.5 rounded-none animate-pulse ${isElon ? 'bg-cyber-cyan' : isGoggins ? 'bg-red-500' : 'bg-amber-400'}`} style={{ animationDelay: '0.4s' }} />
                                <span className="text-[10px] uppercase tracking-widest opacity-70 ml-2 font-cyber font-black">
                                    {isElon ? 'NEURAL_PROCESSING...' : isGoggins ? 'GRINDING_DATA...' : 'LIFTING_WISDOM...'}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 relative z-20">
                <div className={`p-1 border transition-all duration-300 flex gap-2 items-center cyber-clipper bg-black/40 ${isElon ? 'border-cyber-cyan/50 shadow-[0_0_30px_rgba(0,255,255,0.1)]' : isGoggins ? 'border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.1)]' : 'border-amber-400/50 shadow-[0_0_30px_rgba(251,191,36,0.1)]'}`}>
                    <div className="flex-1 flex items-center">
                        <span className={`pl-4 font-cyber font-black text-xs ${isElon ? 'text-cyber-cyan' : isGoggins ? 'text-red-500' : 'text-amber-400'}`}>{'>'}</span>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={isElon ? "프로젝트나 아이디어에 대해 물어봐..." : isGoggins ? "오늘 뭘 했는지 보고해. STAY HARD!" : "형한테 고민 말해봐. 같이 풀어보자."}
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
                                    : isGoggins
                                        ? 'bg-red-600 text-black hover:bg-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.6)]'
                                        : 'bg-amber-400 text-black hover:bg-amber-300 hover:shadow-[0_0_20px_rgba(251,191,36,0.6)]'
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
