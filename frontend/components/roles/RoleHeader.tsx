"use client";

import React from "react";

const RoleHeader: React.FC = () => {
  return (
    <div className="flex justify-between items-center mb-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Role Master</h1>
        <p className="text-slate-500 mt-1">
          Define system roles and permission levels
        </p>
      </div>
    </div>
  );
};

export default RoleHeader;
