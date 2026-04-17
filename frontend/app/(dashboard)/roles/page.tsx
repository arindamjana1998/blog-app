'use client';

import React, { useEffect, useState } from 'react';
import { userService } from '@/services/contentService';
import { Role } from '@/types';
import { Shield, Info, Plus } from 'lucide-react';

const RolesPage = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const data = await userService.getRoles();
                setRoles(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRoles();
    }, []);

    if (loading) return <div className="p-8">Loading roles...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Role Master</h1>
                    <p className="text-slate-500 mt-1">Define system roles and permission levels</p>
                </div>
                <button className="bg-slate-900 border border-slate-800 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all hover:bg-slate-800">
                    <Plus className="w-5 h-5" />
                    New Role
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {roles.map((role) => (
                    <div key={role._id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm transition-all hover:shadow-xl group">
                        <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
                        <div className="p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2.5 bg-blue-50 rounded-2xl text-blue-600">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">{role.name}</h3>
                            </div>
                            
                            <p className="text-slate-500 text-sm leading-relaxed mb-6 h-10 overflow-hidden">
                                {role.description || 'Access and permissions defined for this system role.'}
                            </p>

                            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl">
                                <Info className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Slug Identifier</p>
                                    <code className="text-xs bg-white px-2 py-0.5 rounded border border-slate-100 text-blue-600 font-bold">{role.slug}</code>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RolesPage;
