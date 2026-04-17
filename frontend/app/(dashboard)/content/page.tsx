"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { contentService } from "@/services/contentService";
import { Content, ContentStatus } from "@/types";
import { useAuth } from "@/context/AuthContext";
import {
  Plus,
  MoreVertical,
  Send,
  CheckCircle,
  XCircle,
  Edit3,
  Eye,
  History,
  FileEdit,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import ContentModal from "@/components/ui/ContentModal";
import DetailsModal from "@/components/ui/DetailsModal";
import WorkflowModal from "@/components/ui/WorkflowModal";

const ContentPage = () => {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [workflowType, setWorkflowType] = useState<"approve" | "reject">(
    "approve",
  );
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status");

  const filteredContents = contents.filter((c) => {
    if (!statusFilter || statusFilter === "ALL") return true;
    return c.status === statusFilter;
  });

  const fetchContents = async () => {
    try {
      const data = await contentService.getContents();
      setContents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
  }, []);

  const handleAction = async (content: Content, action: string) => {
    if (action === "edit") {
      setSelectedContent(content);
      setIsCreateModalOpen(true);
    } else if (action === "submit") {
      if (confirm("Submit this content for Level 1 review?")) {
        await contentService.submitContent(content._id);
        fetchContents();
      }
    } else if (action === "approve") {
      setSelectedContent(content);
      setWorkflowType("approve");
      setIsWorkflowModalOpen(true);
    } else if (action === "reject") {
      setSelectedContent(content);
      setWorkflowType("reject");
      setIsWorkflowModalOpen(true);
    }
  };

  const getStatusBadge = (status: ContentStatus) => {
    const styles = {
      DRAFT: "bg-slate-100 text-slate-600 border-slate-200",
      PENDING_L1: "bg-amber-100 text-amber-600 border-amber-200",
      PENDING_L2: "bg-indigo-100 text-indigo-600 border-indigo-200",
      APPROVED: "bg-emerald-100 text-emerald-600 border-emerald-200",
      REJECTED: "bg-red-100 text-red-600 border-red-200",
    };
    return (
      <span
        className={cn(
          "px-2.5 py-1 rounded-full text-xs font-bold border uppercase tracking-tight",
          styles[status],
        )}
      >
        {status.replace("_", " ")}
      </span>
    );
  };

  if (loading) return <div className="p-8">Loading content...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Content Management
          </h1>
          <p className="text-slate-500 mt-1">
            Create and manage your content approval lifecycle
          </p>
        </div>
        {(user?.role.slug === "admin" || user?.role.slug === "creator") && (
          <button
            onClick={() => {
              setSelectedContent(null);
              setIsCreateModalOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            New Content
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-bottom border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Title
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Status
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Created By
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Version
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Last Updated
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredContents.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-slate-400"
                >
                  No content found. Start by creating some!
                </td>
              </tr>
            ) : (
              filteredContents.map((content) => (
                <tr
                  key={content._id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800">{content.title}</p>
                    <p className="text-xs text-slate-400 truncate max-w-[200px] mt-0.5">
                      {content.description}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(content.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold">
                        {content.createdBy?.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-slate-600">
                        {content.createdBy?.username}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-500">
                      v{content.version}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {formatDate(content.updatedAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Creator Actions */}
                      {content.isEditable &&
                        (user?.role.slug === "admin" ||
                          user?.role.slug === "creator") && (
                          <>
                            <button
                              onClick={() => handleAction(content, "edit")}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleAction(content, "submit")}
                              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="Submit for Review"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          </>
                        )}

                      {/* Reviewer Actions */}
                      {((content.status === "PENDING_L1" &&
                        user?.role.slug === "reviewer_l1") ||
                        (content.status === "PENDING_L2" &&
                          user?.role.slug === "reviewer_l2")) && (
                        <>
                          <button
                            onClick={() => handleAction(content, "approve")}
                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Approve"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleAction(content, "reject")}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => {
                          setSelectedContent(content);
                          setIsDetailsModalOpen(true);
                        }}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ContentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchContents}
        content={selectedContent}
      />

      <WorkflowModal
        isOpen={isWorkflowModalOpen}
        onClose={() => setIsWorkflowModalOpen(false)}
        onSuccess={fetchContents}
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

export default ContentPage;
