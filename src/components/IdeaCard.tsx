import React, { useState } from 'react';
import { ProjectIdea } from '../types';
import { Trash2, Wand2, Sparkles, AlertCircle, Loader2, Hash, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './ui';
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
    <motion.div
      className={clsx(
        "relative group transition-all duration-500 overflow-hidden cyber-clipper-lg",
        "hover:-translate-y-1"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.01 }}
    >
      {/* Card Background */}
      <div className={clsx(
        "absolute inset-0 transition-all duration-500",
        "bg-zinc-950/80 backdrop-blur-xl",
        isFocused ? "border-cyber-cyan/40" : "border-white/10",
        "border"
      )} />

      {/* Hover Glow Effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-cyber-pink/10 via-transparent to-cyber-cyan/5" />
        <div className="absolute inset-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" />
      </motion.div>

      {/* Focus Glow */}
      {isFocused && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="absolute inset-0 shadow-[0_0_30px_rgba(0,255,255,0.15)]" />
        </motion.div>
      )}

      <div className="relative z-10 p-6">
        {/* Top Row: Emoji, Title, Actions */}
        <div className="flex items-start gap-5 mb-6">
          {/* Emoji Box */}
          <motion.div
            className={clsx(
              "shrink-0 w-16 h-16 bg-black/40 border flex items-center justify-center text-4xl relative transition-all duration-300 cyber-clipper",
              isHovered ? "border-cyber-pink/50 shadow-[0_0_20px_rgba(255,0,255,0.2)]" : "border-white/10"
            )}
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            {idea.emoji || '💡'}

            {/* Loading overlay */}
            {isMagicLoading && (
              <motion.div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Loader2 size={24} className="text-cyber-pink animate-spin" />
              </motion.div>
            )}

            {/* Complete indicator */}
            {isComplete && !isMagicLoading && (
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 bg-cyber-cyan rounded-full shadow-[0_0_10px_rgba(0,255,255,0.8)] flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                <span className="text-[8px] text-black font-bold">✓</span>
              </motion.div>
            )}
          </motion.div>

          {/* Title Input */}
          <div className="flex-1 min-w-0">
            <label className="text-[10px] font-medium text-white/30 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Hash size={10} /> Project Title
            </label>
            <input
              className="w-full bg-transparent text-2xl font-bold text-white placeholder-white/20 border-none focus:ring-0 focus:outline-none py-1 transition-all tracking-tight"
              placeholder="프로젝트 제목을 입력하세요..."
              value={idea.title}
              onChange={(e) => onChange(idea.id, 'title', e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>

          {/* Action Buttons */}
          <div className={clsx(
            "flex items-center gap-2 transition-all duration-300",
            isHovered ? "opacity-100" : "opacity-0"
          )}>
            {onMagic && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  className={clsx(
                    "h-10 px-5 text-[11px] font-medium tracking-widest uppercase cyber-clipper",
                    "text-cyber-cyan border border-cyber-cyan/30",
                    "hover:bg-cyber-cyan hover:text-black hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]",
                    "transition-all"
                  )}
                  onClick={() => onMagic(idea.id)}
                  isLoading={isMagicLoading}
                >
                  <span className="flex items-center gap-2">
                    <Wand2 size={14} className={isMagicLoading ? "animate-spin" : ""} />
                    {isMagicLoading ? '처리중' : 'AI_정제'}
                  </span>
                </Button>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(idea.id)}
              className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/20 hover:text-red-500 hover:border-red-500/50 hover:bg-red-500/10 transition-all cyber-clipper"
            >
              <Trash2 size={16} />
            </motion.button>
          </div>
        </div>

        {/* Description Textarea */}
        <div className="relative">
          <label className="text-[10px] font-medium text-white/30 uppercase tracking-widest mb-2 flex items-center gap-2">
            <FileText size={10} /> Description
          </label>
          <div className="relative">
            <textarea
              className={clsx(
                "w-full bg-black/30 border p-5 text-base text-white/70 placeholder-white/20 resize-none cyber-clipper",
                "focus:ring-0 focus:outline-none focus:text-white h-32 leading-relaxed transition-all",
                isFocused ? "border-cyber-cyan/30" : "border-white/5 hover:border-white/10"
              )}
              placeholder="프로젝트에 대한 설명, 해결하려는 문제, 대상 시장 등을 입력하세요..."
              value={idea.description}
              onChange={(e) => onChange(idea.id, 'description', e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />

            {/* AI hint */}
            {idea.title.length > 2 && idea.description.length < 10 && !isMagicLoading && (
              <motion.div
                className="absolute right-3 top-3 flex items-center gap-2 text-[10px] font-medium text-cyber-cyan bg-cyber-cyan/10 px-3 py-1.5 rounded-full border border-cyber-cyan/30"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Sparkles size={12} className="animate-pulse" /> AI로 자동 완성
              </motion.div>
            )}
          </div>
        </div>

        {/* Footer Status */}
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-[10px] font-medium text-white/20">
            <motion.div
              className={clsx(
                "w-2 h-2 rounded-full transition-all",
                isComplete ? "bg-cyber-cyan shadow-[0_0_8px_rgba(0,255,255,0.8)]" : "bg-white/20"
              )}
              animate={isComplete ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span>{isComplete ? 'Ready for Analysis' : 'Incomplete'}</span>
          </div>
          <span className="text-[9px] font-mono text-white/10 uppercase tracking-wider">
            ID: {idea.id.substring(0, 8)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};