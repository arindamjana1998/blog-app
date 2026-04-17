"use client";

import React from "react";
import { Role } from "@/types";
import { Shield, Info } from "lucide-react";

interface RoleTableProps {
  roles: Role[];
}

const RoleTable: React.FC<RoleTableProps> = ({ roles }) => {
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
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">
              Slug Identifier
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {roles.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-6 py-12 text-center text-slate-400">
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
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Info className="w-3.5 h-3.5 text-blue-400" />
                    <code className="text-xs bg-slate-50 px-2 py-1 rounded border border-slate-100 text-blue-600 font-bold">
                      {role.slug}
                    </code>
                  </div>
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
