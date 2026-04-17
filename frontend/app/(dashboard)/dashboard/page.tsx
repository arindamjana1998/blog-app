"use client";

import React, { useEffect, useState } from "react";
import { contentService } from "@/services/contentService";
import { DashboardSummary } from "@/types";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { cn, formatDate } from "@/lib/utils";
import SummaryModal from "@/components/ui/SummaryModal";

const DashboardPage = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  const fetchSummary = async () => {
    try {
      const data = await contentService.getDashboardSummary();
      setSummary(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const openSummary = (status: string) => {
    setSelectedStatus(status);
    setIsSummaryModalOpen(true);
  };

  const stats = [
    {
      label: "Total Content",
      value: summary?.totalContent || 0,
      icon: FileText,
      color: "blue",
      status: "ALL",
    },
    {
      label: "Pending L1",
      value: summary?.PENDING_L1 || 0,
      icon: Clock,
      color: "amber",
      status: "PENDING_L1",
    },
    {
      label: "Pending L2",
      value: summary?.PENDING_L2 || 0,
      icon: Clock,
      color: "indigo",
      status: "PENDING_L2",
    },
    {
      label: "Approved",
      value: summary?.APPROVED || 0,
      icon: CheckCircle2,
      color: "emerald",
      status: "APPROVED",
    },
    {
      label: "Rejected",
      value: summary?.REJECTED || 0,
      icon: XCircle,
      color: "red",
      status: "REJECTED",
    },
    {
      label: "Drafts",
      value: summary?.DRAFT || 0,
      icon: AlertCircle,
      color: "slate",
      status: "DRAFT",
    },
  ];

  const downloadReport = async () => {
    try {
      const data = await contentService.getContents();
      const headers = [
        "Title",
        "Status",
        "Version",
        "Created By",
        "Created At",
      ];
      const rows = data.map((item) => [
        item.title,
        item.status,
        item.version,
        item.createdBy?.username || "N/A",
        formatDate(item.createdAt),
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.join(",")),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `CMS_Report_${new Date().toISOString().split("T")[0]}.csv`,
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to download report:", err);
      alert("Failed to generate report");
    }
  };

  if (loading)
    return (
      <div className="p-8 space-y-8 animate-pulse">
        <div className="h-10 w-48 bg-slate-200 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-2">
          Overview of content approval workflow status
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            onClick={() => openSummary(stat.status)}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group block cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 font-medium text-sm mb-1">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {stat.value}
                </p>
              </div>
              <div
                className={cn(
                  "p-3 rounded-xl",
                  stat.color === "blue" && "bg-blue-50 text-blue-600",
                  stat.color === "amber" && "bg-amber-50 text-amber-600",
                  stat.color === "emerald" && "bg-emerald-50 text-emerald-600",
                  stat.color === "red" && "bg-red-50 text-red-600",
                  stat.color === "indigo" && "bg-indigo-50 text-indigo-600",
                  stat.color === "slate" && "bg-slate-50 text-slate-600",
                )}
              >
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-slate-400 group-hover:text-slate-600 transition-colors">
              <span>View Details</span>
              <ArrowUpRight className="w-3 h-3 ml-1" />
            </div>
            <div
              className={cn(
                "absolute bottom-0 left-0 h-1 transition-all duration-300 group-hover:w-full w-0",
                stat.color === "blue" && "bg-blue-600",
                stat.color === "amber" && "bg-amber-600",
                stat.color === "emerald" && "bg-emerald-600",
                stat.color === "red" && "bg-red-600",
                stat.color === "indigo" && "bg-indigo-600",
                stat.color === "slate" && "bg-slate-600",
              )}
            />
          </div>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Workflow Progress</h2>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">
                1
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-semibold">L1 Pending</span>
                  <span className="text-sm text-slate-500">
                    {summary?.PENDING_L1 || 0}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full">
                  <div
                    className="bg-amber-500 h-2 rounded-full transition-all duration-1000"
                    style={{
                      width: `${((summary?.PENDING_L1 || 0) / (summary?.totalContent || 1)) * 100}%`,
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
                  <span className="text-sm font-semibold">L2 Pending</span>
                  <span className="text-sm text-slate-500">
                    {summary?.PENDING_L2 || 0}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full">
                  <div
                    className="bg-indigo-500 h-2 rounded-full transition-all duration-1000"
                    style={{
                      width: `${((summary?.PENDING_L2 || 0) / (summary?.totalContent || 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            {summary?.APPROVED || 0}
          </h2>
          <p className="text-slate-500">Items Fully Approved</p>
          <button
            onClick={downloadReport}
            className="mt-8 px-6 py-2 border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            Download Report
          </button>
        </div>
      </div>

      <SummaryModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        onSuccess={fetchSummary}
        status={selectedStatus}
      />
    </div>
  );
};

export default DashboardPage;
