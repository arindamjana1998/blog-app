"use client";

import React from "react";
import { DashboardSummary } from "@/types";

interface WorkflowProgressProps {
  summary: DashboardSummary | null;
}

const WorkflowProgress: React.FC<WorkflowProgressProps> = ({ summary }) => {
  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
      <h2 className="text-xl font-bold mb-6">Workflow Progress</h2>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">
            1
          </div>
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-semibold">In Review</span>
              <span className="text-sm text-slate-500">
                {summary?.pending_review_level_1 || 0}
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full">
              <div
                className="bg-amber-500 h-2 rounded-full transition-all duration-1000"
                style={{
                  width: `${((summary?.pending_review_level_1 || 0) / (summary?.totalContent || 1)) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">
            2
          </div>
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-semibold">Approved</span>
              <span className="text-sm text-slate-500">
                {summary?.approved || 0}
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full">
              <div
                className="bg-indigo-500 h-2 rounded-full transition-all duration-1000"
                style={{
                  width: `${((summary?.approved || 0) / (summary?.totalContent || 1)) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowProgress;
