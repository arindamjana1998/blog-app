"use client";

import React from "react";
import { User } from "@/types";
import { Mail, ShieldCheck, Trash2 } from "lucide-react";

interface UserTableProps {
  users: User[];
  onDelete: (id: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-bottom border-slate-100">
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
              User
            </th>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
              Email
            </th>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
              Role
            </th>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {users.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                No users found.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr
                key={user._id}
                className="hover:bg-slate-50/50 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center font-bold text-blue-600">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-bold text-slate-800 capitalize">
                      {user.username}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 section">
                  <div className="flex items-center gap-1 text-slate-500">
                    <Mail className="w-3 h-3" />
                    <span className="text-sm">{user.username}@cms.com</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg border border-slate-200 w-fit">
                    <ShieldCheck className="w-3 h-3 text-slate-500" />
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                      {user.role?.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  {user.role?.slug !== "admin" && (
                    <button
                      onClick={() => onDelete(user._id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete User"
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

export default UserTable;
