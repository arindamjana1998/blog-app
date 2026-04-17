"use client";

import React from "react";

interface DashboardHeaderProps {
  title: string;
  description: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, description }) => {
  return (
    <div className="mb-10">
      <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
      <p className="text-slate-500 mt-2">{description}</p>
    </div>
  );
};

export default DashboardHeader;
