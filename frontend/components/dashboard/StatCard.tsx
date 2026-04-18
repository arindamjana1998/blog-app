"use client";

import React from "react";
import { LucideIcon, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
  onClick: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  color,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group block cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-500 font-medium text-sm mb-1">{label}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div
          className={cn(
            "p-3 rounded-xl",
            color === "blue" && "bg-blue-50 text-blue-600",
            color === "amber" && "bg-amber-50 text-amber-600",
            color === "emerald" && "bg-emerald-50 text-emerald-600",
            color === "red" && "bg-red-50 text-red-600",
            color === "indigo" && "bg-indigo-50 text-indigo-600",
            color === "slate" && "bg-slate-50 text-slate-600",
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="mt-4 flex items-center text-xs font-semibold text-slate-400 group-hover:text-slate-600 transition-colors">
        <span>View Details</span>
        <ArrowUpRight className="w-3 h-3 ml-1" />
      </div>
      <div
        className={cn(
          "absolute bottom-0 left-0 h-1 transition-all duration-300 group-hover:w-full w-0",
          color === "blue" && "bg-blue-600",
          color === "amber" && "bg-amber-600",
          color === "emerald" && "bg-emerald-600",
          color === "red" && "bg-red-600",
          color === "indigo" && "bg-indigo-600",
          color === "slate" && "bg-slate-600",
        )}
      />
    </div>
  );
};

export default StatCard;
