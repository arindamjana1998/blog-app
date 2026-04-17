"use client";

import React from "react";
import { Content } from "@/types";
import { X, FileText, History } from "lucide-react";
import HistoryTimeline from "./HistoryTimeline";

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: Content | null;
}

const DetailsModal: React.FC<DetailsModalProps> = ({
  isOpen,
  onClose,
  content,
}) => {
  if (!isOpen || !content) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 line-clamp-1">
                {content.title}
              </h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Content Details & History
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
                Description
              </h3>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-slate-700 leading-relaxed whitespace-pre-wrap">
                {content.description}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Status
                </p>
                <p className="font-bold text-blue-600">
                  {content.status.replace("_", " ")}
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Version
                </p>
                <p className="font-bold text-slate-600">v{content.version}</p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-6">
              <History className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                Approval History
              </h3>
            </div>
            <HistoryTimeline history={content.approvalHistory} />
          </div>
        </div>

        <div className="p-6 border-t border-slate-50 bg-slate-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;
