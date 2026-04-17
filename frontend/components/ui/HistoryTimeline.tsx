'use client';

import React from 'react';
import { ApprovalHistory } from '@/types';
import { CheckCircle2, XCircle, Send, User } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';

interface HistoryTimelineProps {
    history: ApprovalHistory[];
}

const HistoryTimeline: React.FC<HistoryTimelineProps> = ({ history }) => {
    if (!history || history.length === 0) return (
        <div className="p-8 text-center text-slate-400 italic">No history available</div>
    );

    return (
        <div className="space-y-6">
            {history.slice().reverse().map((item, idx) => (
                <div key={idx} className="relative flex gap-4">
                    {idx !== history.length - 1 && (
                        <div className="absolute left-[19px] top-10 bottom-0 w-px bg-slate-200" />
                    )}
                    
                    <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-4 border-white shadow-sm z-10",
                        item.action === 'APPROVED' ? "bg-emerald-500 text-white" : 
                        item.action === 'REJECTED' ? "bg-red-500 text-white" : 
                        "bg-blue-500 text-white"
                    )}>
                        {item.action === 'APPROVED' ? <CheckCircle2 className="w-5 h-5" /> : 
                         item.action === 'REJECTED' ? <XCircle className="w-5 h-5" /> : 
                         <Send className="w-4 h-4" />}
                    </div>

                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex-1">
                        <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold text-slate-900">
                                {item.action === 'SUBMITTED' ? 'Submitted' : 
                                 item.action === 'APPROVED' ? `Approved (L${item.step})` : 'Rejected'}
                            </h4>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">{formatDate(item.actedAt)}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center">
                                <User className="w-2.5 h-2.5 text-slate-500" />
                            </div>
                            <span className="text-xs font-medium text-slate-500">by {item.actedBy.username}</span>
                        </div>

                        {item.comment && (
                            <div className="bg-white p-3 rounded-lg border border-slate-100 text-sm text-slate-600 italic">
                                "{item.comment}"
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HistoryTimeline;
