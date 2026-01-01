import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Command,
    X,
    FolderKanban,
    LayoutDashboard,
    Kanban,
    Target,
    ArrowRight,
    Clock,
    Sparkles
} from 'lucide-react';
import { AppView, ProjectScheme } from '../../types';

interface QuickSearchProps {
    isOpen: boolean;
    onClose: () => void;
    projects: ProjectScheme[];
    onNavigate: (view: AppView) => void;
    onSelectProject: (projectId: string) => void;
}

interface SearchResult {
    id: string;
    type: 'navigation' | 'project' | 'action';
    title: string;
    subtitle?: string;
    icon: React.ReactNode;
    action: () => void;
}

export const QuickSearch: React.FC<QuickSearchProps> = ({
    isOpen,
    onClose,
    projects,
    onNavigate,
    onSelectProject,
}) => {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);

    // 검색 결과 생성
    const results = useMemo<SearchResult[]>(() => {
        const baseNavigations: SearchResult[] = [
            {
                id: 'nav-home',
                type: 'navigation',
                title: 'Go to Home',
                subtitle: 'Landing page',
                icon: <Target size={16} />,
                action: () => { onNavigate(AppView.LANDING); onClose(); }
            },
            {
                id: 'nav-projects',
                type: 'navigation',
                title: 'Mission Hub',
                subtitle: 'View all projects',
                icon: <FolderKanban size={16} />,
                action: () => { onNavigate(AppView.PROJECT_LIST); onClose(); }
            },
            {
                id: 'nav-dashboard',
                type: 'navigation',
                title: 'Control Deck',
                subtitle: 'Project dashboard',
                icon: <LayoutDashboard size={16} />,
                action: () => { onNavigate(AppView.DASHBOARD); onClose(); }
            },
            {
                id: 'nav-kanban',
                type: 'navigation',
                title: 'Task Matrix',
                subtitle: 'Kanban board',
                icon: <Kanban size={16} />,
                action: () => { onNavigate(AppView.KANBAN); onClose(); }
            },
        ];

        const projectResults: SearchResult[] = projects.map(project => ({
            id: `project-${project.id}`,
            type: 'project' as const,
            title: project.selectedIdea.title || 'Untitled Project',
            subtitle: `${project.monthlyPlan.length} months • ${project.selectedIdea.emoji || '🎯'}`,
            icon: <span className="text-base">{project.selectedIdea.emoji || '🎯'}</span>,
            action: () => { onSelectProject(project.id); onNavigate(AppView.DASHBOARD); onClose(); }
        }));

        const actions: SearchResult[] = [
            {
                id: 'action-new',
                type: 'action',
                title: 'Create New Mission',
                subtitle: 'Start a new project',
                icon: <Sparkles size={16} className="text-cyber-pink" />,
                action: () => { onNavigate(AppView.BRAIN_DUMP); onClose(); }
            },
        ];

        const allResults = [...baseNavigations, ...projectResults, ...actions];

        if (!query.trim()) {
            return allResults.slice(0, 8);
        }

        const lowerQuery = query.toLowerCase();
        return allResults.filter(result =>
            result.title.toLowerCase().includes(lowerQuery) ||
            result.subtitle?.toLowerCase().includes(lowerQuery)
        );
    }, [query, projects, onNavigate, onSelectProject, onClose]);

    // 키보드 네비게이션
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!isOpen) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => Math.max(prev - 1, 0));
                break;
            case 'Enter':
                e.preventDefault();
                if (results[selectedIndex]) {
                    results[selectedIndex].action();
                }
                break;
            case 'Escape':
                e.preventDefault();
                onClose();
                break;
        }
    }, [isOpen, results, selectedIndex, onClose]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Reset on open
    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    // Reset selection on query change
    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-start justify-center pt-[15vh]"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: -20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: -20 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        className="w-full max-w-2xl bg-zinc-900/95 border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Search Input */}
                        <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
                            <Search size={20} className="text-zinc-500" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search commands, projects, actions..."
                                className="flex-1 bg-transparent text-white text-lg outline-none placeholder:text-zinc-500"
                                autoFocus
                            />
                            <div className="flex items-center gap-1 text-zinc-500">
                                <kbd className="px-2 py-1 bg-zinc-800 rounded text-xs font-mono">esc</kbd>
                            </div>
                        </div>

                        {/* Results */}
                        <div className="max-h-[400px] overflow-y-auto py-2">
                            {results.length === 0 ? (
                                <div className="px-4 py-8 text-center">
                                    <div className="text-zinc-500 text-sm">No results found</div>
                                    <div className="text-zinc-600 text-xs mt-1">Try a different search term</div>
                                </div>
                            ) : (
                                <>
                                    {/* Group by type */}
                                    {['navigation', 'project', 'action'].map(type => {
                                        const typeResults = results.filter(r => r.type === type);
                                        if (typeResults.length === 0) return null;

                                        return (
                                            <div key={type}>
                                                <div className="px-4 py-2">
                                                    <span className="text-[10px] font-cyber text-zinc-600 uppercase tracking-wider">
                                                        {type === 'navigation' ? 'NAVIGATE' : type === 'project' ? 'PROJECTS' : 'ACTIONS'}
                                                    </span>
                                                </div>
                                                {typeResults.map((result, idx) => {
                                                    const globalIndex = results.findIndex(r => r.id === result.id);
                                                    return (
                                                        <button
                                                            key={result.id}
                                                            onClick={result.action}
                                                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                                                            className={`w-full px-4 py-3 flex items-center gap-3 transition-colors ${selectedIndex === globalIndex
                                                                    ? 'bg-cyber-pink/10 text-white'
                                                                    : 'text-zinc-400 hover:bg-white/5'
                                                                }`}
                                                        >
                                                            <span className={selectedIndex === globalIndex ? 'text-cyber-pink' : 'text-zinc-500'}>
                                                                {result.icon}
                                                            </span>
                                                            <div className="flex-1 text-left">
                                                                <div className="text-sm font-medium">{result.title}</div>
                                                                {result.subtitle && (
                                                                    <div className="text-xs text-zinc-500">{result.subtitle}</div>
                                                                )}
                                                            </div>
                                                            {selectedIndex === globalIndex && (
                                                                <ArrowRight size={14} className="text-cyber-pink" />
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        );
                                    })}
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-500">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-[10px] font-mono">↑</kbd>
                                    <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-[10px] font-mono">↓</kbd>
                                    <span>navigate</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-[10px] font-mono">↵</kbd>
                                    <span>select</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={12} />
                                <span>Recent items shown first</span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default QuickSearch;
