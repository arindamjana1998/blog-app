"use client";

import React from "react";
import { ContentStatus } from "@/types";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: ContentStatus;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const styles: Record<string, string> = {
    draft: "bg-slate-100 text-slate-600 border-slate-200",
    pending_review_level_1: "bg-amber-100 text-amber-600 border-amber-200",
    pending_review_level_2: "bg-orange-100 text-orange-600 border-orange-200",
    approved: "bg-emerald-100 text-emerald-600 border-emerald-200",
    rejected: "bg-red-100 text-red-600 border-red-200",
    published: "bg-blue-100 text-blue-600 border-blue-200",
  };

  return (
    <span
      className={cn(
        "px-2.5 py-1 rounded-full text-xs font-bold border uppercase tracking-tight whitespace-nowrap",
        styles[status] || styles.draft,
        className,
      )}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
};

export default StatusBadge;
