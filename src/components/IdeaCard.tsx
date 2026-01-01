import React, { useState } from 'react';
import { ProjectIdea } from '../types';
import { Trash2, Wand2, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { clsx } from 'clsx';

interface IdeaCardProps {
  idea: ProjectIdea;
  onChange: (id: string, field: keyof ProjectIdea, value: string) => void;
  onDelete: (id: string) => void;
  onMagic?: (id: string) => void;
  isMagicLoading?: boolean;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({
  idea,
  onChange,
  onDelete,
  onMagic,
  isMagicLoading
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isComplete = idea.title && idea.description;

  return (
    <div
      className={clsx(
        "glass-panel border-white/5 p-6 space-y-6 relative group transition-all duration-500 skew-x-[-1deg]",
        "hover:border-cyber-pink/40 hover:shadow-[0_0_40px_rgba(255,0,255,0.15)]",
        "hover:-translate-y-1",
        isFocused && "border-cyber-cyan/30 shadow-[0_0_30px_rgba(0,255,255,0.1)]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background glow */}
      <div className={clsx(
        "absolute -inset-px bg-gradient-to-r from-cyber-pink/0 via-cyber-pink/10 to-cyber-cyan/0 opacity-0 transition-opacity duration-700 pointer-events-none",
        isHovered && "opacity-100"
      )} />

      <div className="skew-x-[1deg] relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6">

          {/* Status Badge with animation */}
          <div className="flex flex-col gap-2">
            <div className={clsx(
              "shrink-0 w-14 h-14 border-2 border-white/10 bg-black flex items-center justify-center text-3xl shadow-inner relative transition-all duration-300",
              isHovered && "border-cyber-cyan scale-110 shadow-neon-cyan"
            )}>
              {idea.emoji || '💡'}
              {isMagicLoading && (
                <div className="absolute inset-0 bg-cyber-pink/30 flex items-center justify-center backdrop-blur-sm">
                  <Loader2 size={24} className="text-cyber-pink animate-spin" />
                </div>
              )}
              {/* Success indicator */}
              {isComplete && !isMagicLoading && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyber-cyan rounded-full animate-pulse shadow-neon-cyan" />
              )}
            </div>
          </div>

          <div className="flex-1 w-full relative pt-2">
            <div className={clsx(
              "text-[10px] font-cyber font-black uppercase tracking-[0.3em] mb-1 transition-colors duration-300",
              isFocused ? "text-cyber-cyan" : "text-white/20"
            )}>
              Entity_Identification::개체_식별
            </div>
            <input
              className="bg-transparent text-2xl font-cyber font-black text-white placeholder-white/10 w-full border-none focus:ring-0 focus:outline-none py-1 transition-all uppercase tracking-tight hover:text-cyber-pink focus:text-white"
              placeholder="프로젝트_제목_입력..."
              value={idea.title}
              onChange={(e) => onChange(idea.id, 'title', e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            {/* Animated hint when ready for AI */}
            {idea.title.length > 2 && idea.description.length < 10 && !isMagicLoading && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] font-cyber font-black text-cyber-cyan animate-pulse hidden md:flex items-center gap-2 bg-cyber-cyan/5 px-3 py-1 border border-cyber-cyan/30">
                <Sparkles size={12} className="animate-bounce" /> AI_정제_초기화
              </div>
            )}
          </div>

          <div className={clsx(
            "flex items-center gap-4 self-end md:self-auto transition-all duration-300",
            isHovered ? "opacity-100 translate-x-0" : "opacity-60 translate-x-2"
          )}>
            {onMagic && (
              <Button
                variant="ghost"
                className={clsx(
                  "h-10 px-4 text-[10px] font-cyber font-black tracking-widest text-cyber-cyan border-2 border-cyber-cyan/20 hover:bg-cyber-cyan hover:text-black hover:shadow-neon-cyan transition-all uppercase skew-x-[-10deg]",
                  isMagicLoading && "animate-pulse"
                )}
                onClick={() => onMagic(idea.id)}
                isLoading={isMagicLoading}
              >
                <span className="skew-x-[10deg] flex items-center gap-2">
                  <Wand2 size={14} className={isMagicLoading ? "animate-spin" : "group-hover:rotate-12 transition-transform"} />
                  {isMagicLoading ? '처리_중' : 'REFINER.EXE'}
                </span>
              </Button>
            )}
            <button
              onClick={() => onDelete(idea.id)}
              className="text-white/10 hover:text-red-500 transition-all p-3 border border-white/5 hover:border-red-500/50 hover:bg-red-500/5 hover:scale-110 active:scale-95"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        <div className="relative">
          <div className={clsx(
            "absolute top-0 left-0 w-1 h-full transition-all duration-500",
            isFocused ? "bg-cyber-cyan shadow-neon-cyan" : "bg-white/5"
          )} />
          <textarea
            className="w-full bg-black/40 border-2 border-white/5 p-6 text-sm text-white/60 font-mono placeholder-white/10 resize-none focus:ring-0 focus:border-cyber-pink/30 focus:text-white focus:outline-none h-32 leading-relaxed transition-all pl-8 hover:border-white/10"
            placeholder="뉴럴 범위 정의: 해결하려는 문제, 프로토콜, 대상 시장 등..."
            value={idea.description}
            onChange={(e) => onChange(idea.id, 'description', e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <div className={clsx(
            "absolute top-4 left-3 transition-colors duration-300",
            isFocused ? "text-cyber-cyan" : "text-white/10"
          )}>
            <AlertCircle size={14} />
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center text-[8px] font-cyber font-black text-white/10 uppercase tracking-widest">
          <span className="flex items-center gap-2">
            <span className={clsx(
              "w-2 h-2 rounded-full transition-all duration-300",
              isComplete ? "bg-cyber-cyan animate-pulse" : "bg-white/20"
            )} />
            DATA_STATUS: {isComplete ? 'STABLE::안정' : 'INCOMPLETE::불완전'}
          </span>
          <span className="opacity-50 hover:opacity-100 transition-opacity">CID: {idea.id.substring(0, 8)}</span>
        </div>
      </div>
    </div>
  );
};