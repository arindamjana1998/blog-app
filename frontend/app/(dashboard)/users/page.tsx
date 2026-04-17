'use client';

import React, { useEffect, useState } from 'react';
import { userService } from '@/services/contentService';
import { User, Role } from '@/types';
import { Plus, Trash2, ShieldCheck, Mail } from 'lucide-react';

const UsersPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await userService.getUsers();
                setUsers(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (loading) return <div className="p-8">Loading users...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
                    <p className="text-slate-500 mt-1">Manage system access and roles</p>
                </div>
                <button className="bg-slate-900 border border-slate-800 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all hover:bg-slate-800">
                    <Plus className="w-5 h-5" />
                    Invite User
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((user) => (
                    <div key={user._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center font-bold text-blue-600 text-xl">
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                                <div className="capitalize">
                                    <h3 className="font-bold text-slate-900">{user.username}</h3>
                                    <div className="flex items-center gap-1 text-slate-400 mt-0.5">
                                        <Mail className="w-3 h-3" />
                                        <span className="text-xs">{user.username}@cms.com</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-4">
                            <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
                                <ShieldCheck className="w-3 h-3 text-slate-500" />
                                <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">{user.role?.name}</span>
                            </div>
                            <button className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UsersPage;
