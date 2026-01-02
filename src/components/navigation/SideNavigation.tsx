import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home,
    LayoutDashboard,
    Kanban,
    Settings,
    ChevronLeft,
    ChevronRight,
    Zap,
    Target,
    CalendarDays,
    FolderKanban,
    Sparkles,
    HelpCircle,
    LogOut,
    Moon,
    Sun,
    Command,
    Map,
    Bot
} from 'lucide-react';
import { AppView, ProjectScheme } from '../../types';

interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    view?: AppView;
    action?: () => void;
    badge?: number;
    isActive?: boolean;
}

interface SideNavigationProps {
    currentView: AppView;
    projects: ProjectScheme[];
    activeProjectId: string | null;
    onNavigate: (view: AppView) => void;
    onSelectProject: (projectId: string) => void;
}

export const SideNavigation: React.FC<SideNavigationProps> = ({
    currentView,
    projects,
    activeProjectId,
    onNavigate,
    onSelectProject,
}) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isProjectsExpanded, setIsProjectsExpanded] = useState(true);

    const mainNavItems: NavItem[] = [
        {
            id: 'landing',
            label: 'HOME::BASE',
            icon: <Home size={18} />,
            view: AppView.LANDING
        },
        {
            id: 'projects',
            label: 'MISSION::HUB',
            icon: <FolderKanban size={18} />,
            view: AppView.PROJECT_LIST,
            badge: projects.length
        },
        {
            id: 'dashboard',
            label: 'CONTROL::DECK',
            icon: <LayoutDashboard size={18} />,
            view: AppView.DASHBOARD
        },
        {
            id: 'kanban',
            label: 'TASK::MATRIX',
            icon: <Kanban size={18} />,
            view: AppView.KANBAN
        },
        {
            id: 'campaign-detail',
            label: 'CAMPAIGN::DETAIL',
            icon: <Map size={18} />,
            view: AppView.CAMPAIGN_DETAIL
        },
        {
            id: 'coach',
            label: 'AI::COACH',
            icon: <Bot size={18} />,
            view: AppView.COACH
        },
    ];

    const quickActions: NavItem[] = [
        {
            id: 'new-mission',
            label: 'NEW::MISSION',
            icon: <Sparkles size={18} />,
            view: AppView.BRAIN_DUMP
        },
    ];

    const getStatusColor = (view: AppView) => {
        switch (view) {
            case AppView.DASHBOARD:
                return 'text-cyber-cyan';
            case AppView.KANBAN:
                return 'text-cyber-pink';
            case AppView.PROJECT_LIST:
                return 'text-cyber-yellow';
            default:
                return 'text-zinc-400';
        }
    };

    return (
        <motion.aside
            initial={{ width: 260 }}
            animate={{ width: isCollapsed ? 72 : 260 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-0 top-0 h-screen z-50 bg-zinc-950/95 border-r border-cyber-pink/20 backdrop-blur-2xl flex flex-col"
        >
            {/* Logo Section */}
            <div className="h-20 flex items-center justify-between px-4 border-b border-white/5">
                <AnimatePresence mode="wait">
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex items-center gap-3"
                        >
                            <div className="w-10 h-10 bg-gradient-to-br from-cyber-pink to-cyber-purple flex items-center justify-center shadow-neon-pink skew-x-[-10deg]">
                                <Zap size={20} fill="currentColor" className="text-white skew-x-[10deg]" />
                            </div>
                            <div>
                                <span className="font-cyber font-black text-lg tracking-tighter text-white uppercase italic">
                                    SchemeLand
                                </span>
                                <div className="text-[8px] font-mono text-cyber-cyan/60 tracking-widest">
                                    v2.0::MATRIX
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {isCollapsed && (
                    <div className="w-10 h-10 bg-gradient-to-br from-cyber-pink to-cyber-purple flex items-center justify-center shadow-neon-pink skew-x-[-10deg] mx-auto">
                        <Zap size={20} fill="currentColor" className="text-white skew-x-[10deg]" />
                    </div>
                )}
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
                {/* Status Indicator */}
                <div className={`mx-2 mb-4 px-3 py-2 rounded-sm bg-zinc-900/50 border border-white/5 ${isCollapsed ? 'text-center' : ''}`}>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
                        {!isCollapsed && (
                            <span className="text-[10px] font-cyber text-zinc-400 tracking-wider">
                                SYSTEM::ONLINE
                            </span>
                        )}
                    </div>
                </div>

                {/* Main Nav Items */}
                <div className="space-y-1">
                    {!isCollapsed && (
                        <div className="px-3 py-2 text-[10px] font-cyber text-zinc-600 tracking-widest uppercase">
                            Navigation
                        </div>
                    )}
                    {mainNavItems.map((item) => (
                        <NavButton
                            key={item.id}
                            item={item}
                            isCollapsed={isCollapsed}
                            isActive={currentView === item.view}
                            onClick={() => item.view && onNavigate(item.view)}
                        />
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="mt-6 space-y-1">
                    {!isCollapsed && (
                        <div className="px-3 py-2 text-[10px] font-cyber text-zinc-600 tracking-widest uppercase">
                            Quick Actions
                        </div>
                    )}
                    {quickActions.map((item) => (
                        <NavButton
                            key={item.id}
                            item={item}
                            isCollapsed={isCollapsed}
                            isActive={false}
                            onClick={() => item.view && onNavigate(item.view)}
                            variant="accent"
                        />
                    ))}
                </div>

                {/* Projects Section */}
                {projects.length > 0 && !isCollapsed && (
                    <div className="mt-6">
                        <button
                            onClick={() => setIsProjectsExpanded(!isProjectsExpanded)}
                            className="w-full px-3 py-2 text-[10px] font-cyber text-zinc-600 tracking-widest uppercase flex items-center justify-between hover:text-zinc-400 transition-colors"
                        >
                            <span>Active Missions</span>
                            <motion.span
                                animate={{ rotate: isProjectsExpanded ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ChevronLeft size={12} className="rotate-[-90deg]" />
                            </motion.span>
                        </button>

                        <AnimatePresence>
                            {isProjectsExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden space-y-1"
                                >
                                    {projects.slice(0, 5).map((project) => (
                                        <button
                                            key={project.id}
                                            onClick={() => onSelectProject(project.id)}
                                            className={`w-full px-3 py-2 flex items-center gap-3 rounded-sm transition-all group ${activeProjectId === project.id
                                                ? 'bg-cyber-pink/10 border-l-2 border-cyber-pink text-white'
                                                : 'hover:bg-white/5 text-zinc-400 hover:text-white'
                                                }`}
                                        >
                                            <span className="text-lg">{project.selectedIdea.emoji || '🎯'}</span>
                                            <div className="flex-1 text-left truncate">
                                                <div className="text-xs font-medium truncate">
                                                    {project.selectedIdea.title || 'Untitled Mission'}
                                                </div>
                                                <div className="text-[10px] text-zinc-500 font-mono">
                                                    {project.monthlyPlan.length}mo • {project.monthlyPlan.reduce((acc, m) => acc + (m.detailedPlan?.reduce((a, w) => a + w.tasks.length, 0) || 0), 0)} tasks
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </nav>

            {/* Bottom Section */}
            <div className="border-t border-white/5 p-2">
                {/* Keyboard Shortcut Hint */}
                {!isCollapsed && (
                    <div className="mb-2 px-3 py-2 rounded-sm bg-zinc-900/30 border border-white/5">
                        <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                            <Command size={12} />
                            <span>+ K for quick search</span>
                        </div>
                    </div>
                )}

                {/* Collapse Toggle */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="w-full px-3 py-3 flex items-center justify-center gap-2 rounded-sm bg-zinc-900/50 hover:bg-zinc-800/50 border border-white/5 text-zinc-400 hover:text-white transition-all group"
                >
                    <motion.span
                        animate={{ rotate: isCollapsed ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronLeft size={16} />
                    </motion.span>
                    {!isCollapsed && (
                        <span className="text-xs font-medium">Collapse</span>
                    )}
                </button>
            </div>
        </motion.aside>
    );
};

// Nav Button Component
interface NavButtonProps {
    item: NavItem;
    isCollapsed: boolean;
    isActive: boolean;
    onClick: () => void;
    variant?: 'default' | 'accent';
}

const NavButton: React.FC<NavButtonProps> = ({
    item,
    isCollapsed,
    isActive,
    onClick,
    variant = 'default'
}) => {
    const baseStyles = isCollapsed
        ? "w-full p-3 flex items-center justify-center"
        : "w-full px-3 py-2.5 flex items-center gap-3";

    const activeStyles = isActive
        ? variant === 'accent'
            ? "bg-gradient-to-r from-cyber-pink/20 to-cyber-purple/10 border-l-2 border-cyber-pink text-white shadow-neon-pink"
            : "bg-gradient-to-r from-cyber-cyan/20 to-transparent border-l-2 border-cyber-cyan text-white"
        : "hover:bg-white/5 text-zinc-400 hover:text-white";

    const accentStyles = variant === 'accent' && !isActive
        ? "border border-dashed border-cyber-pink/30 hover:border-cyber-pink/50 text-cyber-pink/70 hover:text-cyber-pink"
        : "";

    return (
        <motion.button
            whileHover={{ x: isCollapsed ? 0 : 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`${baseStyles} ${activeStyles} ${accentStyles} rounded-sm transition-all relative group`}
        >
            <span className={isActive ? 'text-current' : 'text-zinc-500 group-hover:text-current'}>
                {item.icon}
            </span>

            <AnimatePresence>
                {!isCollapsed && (
                    <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="flex-1 text-left text-xs font-cyber tracking-wide"
                    >
                        {item.label}
                    </motion.span>
                )}
            </AnimatePresence>

            {item.badge !== undefined && item.badge > 0 && (
                <span className={`${isCollapsed ? 'absolute -top-1 -right-1' : ''} min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold rounded-full bg-cyber-pink text-white`}>
                    {item.badge}
                </span>
            )}

            {/* Tooltip for collapsed state */}
            {isCollapsed && (
                <div className="absolute left-full ml-2 px-3 py-1.5 bg-zinc-900 border border-white/10 rounded-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                    <span className="text-xs font-cyber text-white">{item.label}</span>
                    <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-zinc-900 border-l border-b border-white/10 rotate-45" />
                </div>
            )}
        </motion.button>
    );
};

export default SideNavigation;
