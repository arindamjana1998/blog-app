"use client";

import React, { useEffect, useState } from "react";
import { contentService } from "@/services/contentService";
import { Content } from "@/types";
import { useAuth } from "@/context/AuthContext";
import {
  X,
  FileText,
  Loader2,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import WorkflowModal from "../content/WorkflowModal";
import DetailsModal from "../content/DetailsModal";

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  status: string;
}

const SummaryModal: React.FC<SummaryModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  status,
}) => {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [workflowType, setWorkflowType] = useState<"approve" | "reject">(
    "approve"
  );
  const { user } = useAuth();

  const fetchContents = async () => {
    setLoading(true);
    try {
      const data = await contentService.getContents();
      const filtered =
        status === "ALL" ? data : data.filter((item) => item.status === status);
      setContents(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchContents();
    }
  }, [isOpen, status]);

  const handleAction = (
    content: Content,
    action: "approve" | "reject" | "details"
  ) => {
    setSelectedContent(content);
    if (action === "details") {
      setIsDetailsModalOpen(true);
    } else {
      setWorkflowType(action);
      setIsWorkflowModalOpen(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
      <div className="bg-white w-full max-w-5xl max-h-[85vh] rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-50 bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {status === "ALL" ? "Total Content" : status.replace("_", " ")}
              </h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                Quick Dashboard View
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-xl shadow-sm transition-all border border-transparent hover:border-slate-100 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              <p className="text-slate-400 font-medium">Fetching details...</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Content
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {contents.length === 0 ? (
                    <tr>
                      <td
                        colSpan={2}
                        className="px-6 py-12 text-center text-slate-400 italic"
                      >
                        No items found for this filter.
                      </td>
                    </tr>
                  ) : (
                    contents.map((content) => (
                      <tr
                        key={content._id}
                        className="hover:bg-slate-50/30 transition-colors group"
                      >
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800 text-lg">
                              {content.title}
                            </span>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                                <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-500">
                                  {content.createdBy?.username
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>
                                {content.createdBy?.username}
                              </span>
                              <span className="w-1 h-1 rounded-full bg-slate-300" />
                              <span className="text-xs text-slate-400">
                                {formatDate(content.updatedAt)}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {((content.status === "PENDING_L1" &&
                              user?.role.slug === "reviewer_l1") ||
                              (content.status === "PENDING_L2" &&
                                user?.role.slug === "reviewer_l2")) && (
                              <>
                                <button
                                  onClick={() =>
                                    handleAction(content, "approve")
                                  }
                                  className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                                  title="Approve"
                                >
                                  <CheckCircle className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleAction(content, "reject")
                                  }
                                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                                  title="Reject"
                                >
                                  <XCircle className="w-5 h-5" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleAction(content, "details")}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                              title="View Details"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-50 bg-slate-50/30 flex justify-between items-center">
          <p className="text-sm text-slate-400 font-medium">
            Showing {contents.length} {contents.length === 1 ? "item" : "items"}
          </p>
          <button
            onClick={onClose}
            className="px-8 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-100 transition-all shadow-sm cursor-pointer"
          >
            Close Summary
          </button>
        </div>
      </div>

      <WorkflowModal
        isOpen={isWorkflowModalOpen}
        onClose={() => setIsWorkflowModalOpen(false)}
        onSuccess={() => {
          fetchContents();
          onSuccess();
        }}
        content={selectedContent}
        type={workflowType}
      />

      <DetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        content={selectedContent}
      />
    </div>
  );
};

export default SummaryModal;
