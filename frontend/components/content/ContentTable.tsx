"use client";

import React from "react";
import { Content } from "@/types";
import { Edit3, Send, CheckCircle, XCircle, Eye, FileUp, Globe } from "lucide-react";
import { formatDate } from "@/lib/utils";
import StatusBadge from "./StatusBadge";
import { useAuth } from "@/context/AuthContext";

interface ContentTableProps {
  contents: Content[];
  onAction: (content: Content, action: string) => void;
  onViewDetails: (content: Content) => void;
}

const ContentTable: React.FC<ContentTableProps> = ({
  contents,
  onAction,
  onViewDetails,
}) => {
  const { user } = useAuth();

  return (
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
          {contents.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                No content found. Start by creating some!
              </td>
            </tr>
          ) : (
            contents.map((content) => (
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
                  <StatusBadge status={content.status} />
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
                    {/* Edit Actions */}
                    {((user?.role === "admin" &&
                      content.status !== "published") ||
                      (user?.role === "creator" &&
                        (content.status === "draft" ||
                          content.status === "rejected") &&
                        content.createdBy?._id === user?._id)) && (
                      <button
                        onClick={() => onAction(content, "edit")}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    )}

                    {/* Submit Actions */}
                    {(content.status === "draft" ||
                      content.status === "rejected") &&
                      (user?.role === "admin" ||
                        (user?.role === "creator" &&
                          content.createdBy?._id === user?._id)) && (
                        <button
                          onClick={() => onAction(content, "submit")}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                          title="Submit for Review"
                        >
                          <FileUp className="w-4 h-4" />
                        </button>
                      )}

                    {/* Review Actions (L1 and L2) */}
                    {(content.status === "pending_review_level_1" ||
                      content.status === "pending_review_level_2") &&
                      (user?.role === "admin" || user?.role === "reviewer") &&
                      // Segregation of Duties check for L2 (Admins exempt)
                      !(user?.role !== "admin" && 
                        content.status === "pending_review_level_2" && 
                        content.approvalHistory.find(h => h.step === 1 && h.action === 'APPROVED')?.actedBy?._id === user?._id) && (
                        <>
                          <button
                            onClick={() => onAction(content, "approve")}
                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title={
                              content.status === "pending_review_level_1"
                                ? "Approve L1"
                                : "Approve L2"
                            }
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onAction(content, "reject")}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}

                    {/* Publish Action */}
                    {content.status === "approved" &&
                      (user?.role === "admin" || user?.role === "reviewer") && (
                        <button
                          onClick={() => onAction(content, "publish")}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Publish"
                        >
                          <Globe className="w-4 h-4" />
                        </button>
                      )}

                    {/* Unpublish Action */}
                    {content.status === "published" &&
                      user?.role === "admin" && (
                        <button
                          onClick={() => onAction(content, "unpublish")}
                          className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          title="Unpublish"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}

                    <button
                      onClick={() => onViewDetails(content)}
                      className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
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
  );
};

export default ContentTable;
