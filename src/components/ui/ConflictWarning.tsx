import React from 'react';
import { AlertTriangle, RefreshCw, X, Shield } from 'lucide-react';

interface ConflictWarningProps {
    isVisible: boolean;
    onDismiss: () => void;
    onReload: () => void;
    sessionId: string;
}

/**
 * 데이터 충돌 경고 배너
 * 다른 브라우저 세션에서 데이터가 변경되었을 때 표시됩니다.
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
                        {/* Icon */}
                        <div className="w-12 h-12 bg-red-500/20 border border-red-500 flex items-center justify-center shrink-0 cyber-clipper">
                            <AlertTriangle size={24} className="text-red-500 animate-pulse" />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <h3 className="font-cyber font-black text-red-400 text-sm uppercase tracking-widest mb-1 flex items-center gap-2">
                                <Shield size={14} />
                                DATA_CONFLICT::DETECTED
                            </h3>
                            <p className="text-red-200/80 text-sm leading-relaxed mb-3">
                                다른 브라우저 또는 탭에서 데이터가 변경되었습니다.
                                <strong className="text-red-300"> 새로고침하지 않으면 데이터가 충돌할 수 있습니다.</strong>
                            </p>

                            {/* Actions */}
                            <div className="flex gap-3 items-center">
                                <button
                                    onClick={onReload}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-black font-cyber font-black text-xs uppercase tracking-widest hover:bg-red-400 transition-all cyber-clipper"
                                >
                                    <RefreshCw size={14} />
                                    최신 데이터 불러오기
                                </button>
                                <button
                                    onClick={onDismiss}
                                    className="flex items-center gap-2 px-4 py-2 border border-red-500/30 text-red-400 font-cyber font-black text-xs uppercase tracking-widest hover:bg-red-500/10 transition-all cyber-clipper"
                                >
                                    현재 작업 유지
                                </button>
                            </div>

                            {/* Session Info */}
                            <div className="mt-3 text-[10px] font-mono text-red-500/50">
                                Session: {sessionId.slice(0, 8)}...
                            </div>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={onDismiss}
                            className="p-1 text-red-500/50 hover:text-red-500 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
