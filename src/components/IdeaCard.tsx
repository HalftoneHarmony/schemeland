import React from 'react';
import { ProjectIdea } from '../types';
import { Trash2, Wand2, Sparkles, AlertCircle } from 'lucide-react';
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
  return (
    <div className="glass-panel border-white/5 p-6 space-y-6 relative group transition-all duration-500 hover:border-cyber-pink/40 hover:shadow-neon-pink/10 skew-x-[-1deg]">
      <div className="skew-x-[1deg]">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6">

          {/* Status Badge */}
          <div className="flex flex-col gap-2">
            <div className="shrink-0 w-14 h-14 border-2 border-white/10 bg-black flex items-center justify-center text-3xl shadow-inner relative group-hover:border-cyber-cyan transition-all">
              {idea.emoji || '💡'}
              {isMagicLoading && (
                <div className="absolute inset-0 bg-cyber-pink/20 animate-pulse flex items-center justify-center">
                  <Wand2 size={24} className="text-cyber-pink animate-spin" />
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 w-full relative pt-2">
            <div className="text-[10px] font-cyber font-black text-white/20 uppercase tracking-[0.3em] mb-1">Entity_Identification::개체_식별</div>
            <input
              className="bg-transparent text-2xl font-cyber font-black text-white placeholder-white/10 w-full border-none focus:ring-0 focus:outline-none py-1 transition-all uppercase tracking-tight"
              placeholder="프로젝트_제목_입력..."
              value={idea.title}
              onChange={(e) => onChange(idea.id, 'title', e.target.value)}
            />
            {/* Contextual Action */}
            {idea.title.length > 2 && idea.description.length < 10 && !isMagicLoading && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] font-cyber font-black text-cyber-cyan animate-pulse hidden md:flex items-center gap-2 bg-cyber-cyan/5 px-3 py-1 border border-cyber-cyan/30">
                <Sparkles size={12} /> AI_정제_초기화
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 self-end md:self-auto">
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
                  <Wand2 size={14} />
                  {isMagicLoading ? '처리_중' : 'REFINER.EXE::정제기'}
                </span>
              </Button>
            )}
            <button
              onClick={() => onDelete(idea.id)}
              className="text-white/10 hover:text-red-500 transition-all p-3 border border-white/5 hover:border-red-500/50 hover:bg-red-500/5"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute top-0 left-0 w-1 h-Full bg-white/5" />
          <textarea
            className="w-full bg-black/40 border-2 border-white/5 p-6 text-sm text-white/60 font-mono placeholder-white/10 resize-none focus:ring-0 focus:border-cyber-pink/30 focus:text-white focus:outline-none h-32 leading-relaxed transition-all pl-8"
            placeholder="뉴럴 범위 정의: 해결하려는 문제, 프로토콜, 대상 시장 등..."
            value={idea.description}
            onChange={(e) => onChange(idea.id, 'description', e.target.value)}
          />
          <div className="absolute top-4 left-3 text-white/10">
            <AlertCircle size={14} />
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center text-[8px] font-cyber font-black text-white/10 uppercase tracking-widest">
          <span>DATA_STATUS::데이터_상태: {idea.title && idea.description ? 'STABLE::안정' : 'INCOMPLETE::불완전'}</span>
          <span>CID: {idea.id.substring(0, 8)}</span>
        </div>
      </div>
    </div>
  );
};