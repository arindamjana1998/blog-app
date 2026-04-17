"use client";

import React from "react";
import { Plus } from "lucide-react";

interface UserHeaderProps {
  onCreateUser: () => void;
}

const UserHeader: React.FC<UserHeaderProps> = ({ onCreateUser }) => {
  return (
    <div className="flex justify-between items-center mb-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
        <p className="text-slate-500 mt-1">Manage system access and roles</p>
      </div>
      <button
        onClick={onCreateUser}
        className="bg-slate-900 border border-slate-800 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all hover:bg-slate-800 cursor-pointer"
      >
        <Plus className="w-5 h-5" />
        Create User
      </button>
    </div>
  );
};

export default UserHeader;
