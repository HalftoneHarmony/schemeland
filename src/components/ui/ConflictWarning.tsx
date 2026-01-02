import React from 'react';
import { AlertTriangle, RefreshCw, X, Shield, GitMerge, Check } from 'lucide-react';

interface ConflictWarningProps {
    isVisible: boolean;
    onDismiss: () => void;
    onReload: () => void;
    sessionId: string;
}

/**
 * 데이터 충돌 경고 배너
 */
export const ConflictWarning: React.FC<ConflictWarningProps> = ({
    isVisible,
    onDismiss,
    onReload,
    sessionId
}) => {
    if (!isVisible) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[9999] animate-slide-down">
            <div className="mx-4 mt-4 md:mx-auto md:max-w-2xl">
                <div className="bg-red-950/95 backdrop-blur-xl border border-red-500/50 p-4 shadow-[0_0_30px_rgba(239,68,68,0.3)] cyber-clipper">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-red-500/20 border border-red-500 flex items-center justify-center shrink-0 cyber-clipper">
                            <AlertTriangle size={24} className="text-red-500 animate-pulse" />
                        </div>

                        <div className="flex-1">
                            <h3 className="font-cyber font-black text-red-400 text-sm uppercase tracking-widest mb-1 flex items-center gap-2">
                                <Shield size={14} />
                                DATA_CONFLICT::DETECTED
                            </h3>
                            <p className="text-red-200/80 text-sm leading-relaxed mb-3">
                                다른 브라우저에서 데이터가 변경되었습니다.
                                <strong className="text-red-300"> 새로고침하여 최신 데이터를 불러오세요.</strong>
                            </p>

                            <div className="flex gap-3 items-center">
                                <button
                                    onClick={onReload}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-black font-cyber font-black text-xs uppercase tracking-widest hover:bg-red-400 transition-all cyber-clipper"
                                >
                                    <RefreshCw size={14} />
                                    새로고침
                                </button>
                                <button
                                    onClick={onDismiss}
                                    className="flex items-center gap-2 px-4 py-2 border border-red-500/30 text-red-400 font-cyber font-black text-xs uppercase tracking-widest hover:bg-red-500/10 transition-all cyber-clipper"
                                >
                                    무시
                                </button>
                            </div>

                            <div className="mt-3 text-[10px] font-mono text-red-500/50">
                                Session: {sessionId.slice(0, 8)}...
                            </div>
                        </div>

                        <button onClick={onDismiss} className="p-1 text-red-500/50 hover:text-red-500 transition-colors">
                            <X size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface MergeNoticeProps {
    isVisible: boolean;
    onDismiss: () => void;
}

/**
 * 데이터 병합 알림 (성공)
 */
export const MergeNotice: React.FC<MergeNoticeProps> = ({
    isVisible,
    onDismiss
}) => {
    if (!isVisible) return null;

    return (
        <div className="fixed top-4 right-4 z-[9999] animate-fade-in-right">
            <div className="bg-green-950/95 backdrop-blur-xl border border-green-500/50 p-4 shadow-[0_0_20px_rgba(34,197,94,0.3)] cyber-clipper max-w-sm">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-500/20 border border-green-500 flex items-center justify-center shrink-0 cyber-clipper">
                        <GitMerge size={20} className="text-green-500" />
                    </div>

                    <div className="flex-1">
                        <h3 className="font-cyber font-black text-green-400 text-xs uppercase tracking-widest mb-1 flex items-center gap-2">
                            <Check size={12} />
                            DATA_MERGED
                        </h3>
                        <p className="text-green-200/80 text-xs leading-relaxed">
                            다른 세션의 데이터와 자동으로 병합되었습니다. 기존 프로젝트는 안전하게 보존됩니다.
                        </p>
                    </div>

                    <button onClick={onDismiss} className="p-1 text-green-500/50 hover:text-green-500 transition-colors">
                        <X size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};
