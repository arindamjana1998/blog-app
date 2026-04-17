"use client";

import React from "react";
import { Role } from "@/types";
import { Shield, Info, Trash2 } from "lucide-react";
import { userService } from "@/services/contentService";
import { toast } from "react-toastify";

interface RoleTableProps {
  roles: Role[];
  onRefresh: () => void;
}

const RoleTable: React.FC<RoleTableProps> = ({ roles, onRefresh }) => {
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      try {
        await userService.deleteRole(id);
        toast.success("Role deleted successfully");
        onRefresh();
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || "Failed to delete role";
        toast.error(errorMsg);
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-bottom border-slate-100">
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
              Role
            </th>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
              Description
            </th>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
              Slug Identifier
            </th>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {roles.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                No roles found.
              </td>
            </tr>
          ) : (
            roles.map((role) => (
              <tr
                key={role._id}
                className="hover:bg-slate-50/50 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                      <Shield className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-800 uppercase tracking-tight">
                      {role.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-500 max-w-md truncate">
                    {role.description ||
                      "Access and permissions defined for this system role."}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Info className="w-3.5 h-3.5 text-blue-400" />
                    <code className="text-xs bg-slate-50 px-2 py-1 rounded border border-slate-100 text-blue-600 font-bold">
                      {role.slug}
                    </code>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  {role.slug !== "admin" && (
                    <button
                      onClick={() => handleDelete(role._id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Role"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RoleTable;
