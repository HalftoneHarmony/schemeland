import React from 'react';
import { ProjectIdea } from '../types';
import { Trash2, Wand2, Sparkles } from 'lucide-react';
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
    <div className="glass-panel rounded-xl p-5 space-y-4 relative group transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_25px_-5px_rgba(139,92,246,0.2)]">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        
        {/* Emoji Icon */}
        <div className="shrink-0 w-12 h-12 rounded-full bg-zinc-800/50 border border-zinc-700 flex items-center justify-center text-2xl shadow-inner">
            {idea.emoji || '💡'}
        </div>

        <div className="flex-1 w-full relative">
            <input
            className="bg-transparent text-xl font-bold text-textMain placeholder-zinc-600 w-full border-none focus:ring-0 focus:outline-none py-1 transition-all"
            placeholder="프로젝트 키워드 (예: 다이어트 앱)"
            value={idea.title}
            onChange={(e) => onChange(idea.id, 'title', e.target.value)}
            />
            {/* Contextual Action */}
            {idea.title.length > 2 && idea.description.length < 10 && !isMagicLoading && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 text-xs text-primary animate-pulse pointer-events-none hidden md:block flex items-center gap-1">
                    <Sparkles size={12}/> AI로 구체화해보세요
                </span>
            )}
        </div>
        
        <div className="flex items-center gap-2 self-end md:self-auto opacity-80 group-hover:opacity-100 transition-opacity">
             {onMagic && (
                <Button 
                    variant="ghost" 
                    className={clsx(
                        "h-9 px-3 text-primary hover:text-white hover:bg-primary/20 transition-all",
                        isMagicLoading && "animate-pulse"
                    )}
                    onClick={() => onMagic(idea.id)}
                    isLoading={isMagicLoading}
                    title="AI 구체화 (매력적인 이름과 설명 생성)"
                >
                    <Wand2 size={16} className={clsx("mr-1", isMagicLoading && "animate-spin")} />
                    {isMagicLoading ? '생성 중...' : 'AI 구체화'}
                </Button>
            )}
            <button 
            onClick={() => onDelete(idea.id)}
            className="text-zinc-600 hover:text-red-500 transition-colors p-2 rounded hover:bg-red-500/10"
            >
            <Trash2 size={18} />
            </button>
        </div>
      </div>
      <textarea
        className="w-full bg-zinc-900/30 rounded-lg p-4 text-sm text-textMuted placeholder-zinc-600 resize-none focus:ring-1 focus:ring-primary/50 focus:bg-zinc-900/50 focus:outline-none border border-transparent focus:border-zinc-700/50 h-28 leading-relaxed transition-all"
        placeholder="해결하려는 문제, 솔루션, 타겟 유저를 구체적으로 적어주세요..."
        value={idea.description}
        onChange={(e) => onChange(idea.id, 'description', e.target.value)}
      />
    </div>
  );
};