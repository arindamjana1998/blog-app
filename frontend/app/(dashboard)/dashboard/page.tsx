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
  Globe,
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatCard from "@/components/dashboard/StatCard";
import WorkflowProgress from "@/components/dashboard/WorkflowProgress";
import SummaryModal from "@/components/dashboard/SummaryModal";

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
      label: "Pending Review",
      value:
        (summary?.pending_review_level_1 || 0) +
        (summary?.pending_review_level_2 || 0),
      icon: Clock,
      color: "amber",
      status: "pending_review_level_1", // Default to L1 for filter
    },
    {
      label: "Approved",
      value: summary?.approved || 0,
      icon: CheckCircle2,
      color: "emerald",
      status: "approved",
    },
    {
      label: "Published",
      value: summary?.published || 0,
      icon: Globe,
      color: "blue",
      status: "published",
    },
    {
      label: "Rejected",
      value: summary?.rejected || 0,
      icon: XCircle,
      color: "red",
      status: "rejected",
    },
    {
      label: "Drafts",
      value: summary?.draft || 0,
      icon: AlertCircle,
      color: "slate",
      status: "draft",
    },
  ];

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
      <DashboardHeader
        title="Dashboard"
        description="Overview of content approval workflow status"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <StatCard
            key={i}
            {...stat}
            onClick={() => openSummary(stat.status)}
          />
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <WorkflowProgress summary={summary} />

        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            {summary?.published || 0}
          </h2>
          <p className="text-slate-500">Items Fully Published</p>
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
