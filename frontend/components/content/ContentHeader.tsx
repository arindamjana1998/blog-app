"use client";

import React from "react";
import { Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface ContentHeaderProps {
  onNewContent: () => void;
}

const ContentHeader: React.FC<ContentHeaderProps> = ({ onNewContent }) => {
  const { user } = useAuth();

  return (
    <div className="flex justify-between items-center mb-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Content Management
        </h1>
        <p className="text-slate-500 mt-1">
          Create and manage your content approval lifecycle
        </p>
      </div>
      {(user?.role === "admin" || user?.role === "creator") && (
        <button
          onClick={onNewContent}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          New Content
        </button>
      )}
    </div>
  );
};

export default ContentHeader;
