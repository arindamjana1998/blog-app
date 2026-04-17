"use client";

import React from "react";
import { ContentStatus } from "@/types";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: ContentStatus;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
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
        className
      )}
    >
      {status.replace("_", " ")}
    </span>
  );
};

export default StatusBadge;
