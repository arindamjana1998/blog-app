'use client';

import React, { useState } from 'react';
import { contentService } from '@/services/contentService';
import { Content } from '@/types';
import { X, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorkflowModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    content: Content | null;
    type: 'approve' | 'reject';
}

const WorkflowModal: React.FC<WorkflowModalProps> = ({ isOpen, onClose, onSuccess, content, type }) => {
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen || !content) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (type === 'approve') {
                await contentService.approveContent(content._id, comment);
            } else {
                await contentService.rejectContent(content._id, comment);
            }
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            setComment('');
        }
    };

    const isApprove = type === 'approve';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-slate-50">
                    <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-lg", isApprove ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600")}>
                            {isApprove ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">{isApprove ? 'Approve Content' : 'Reject Content'}</h2>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">Content Title</p>
                        <p className="font-bold text-slate-800">{content?.title}</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">
                            Comment {isApprove ? '(Optional)' : '(Required)'}
                        </label>
                        <textarea 
                            required={!isApprove}
                            rows={3}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                            placeholder={isApprove ? "Add an optional approval comment..." : "Explain why this content was rejected..."}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="flex-1 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className={cn(
                                "flex-1 py-2.5 text-white rounded-xl font-bold transition-all flex items-center justify-center disabled:opacity-70",
                                isApprove ? "bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20" : "bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/20"
                            )}
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isApprove ? 'Confirm Approval' : 'Confirm Rejection')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default WorkflowModal;
