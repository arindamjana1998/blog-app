import API from './api';
import { Content, DashboardSummary } from '../types';

export const contentService = {
    getContents: async () => {
        const { data } = await API.get<Content[]>('/content');
        return data;
    },
    getContentById: async (id: string) => {
        const { data } = await API.get<Content>(`/content/${id}`);
        return data;
    },
    createContent: async (payload: { title: string; description: string }) => {
        const { data } = await API.post<Content>('/content', payload);
        return data;
    },
    updateContent: async (id: string, payload: { title?: string; description?: string }) => {
        const { data } = await API.put<Content>(`/content/${id}`, payload);
        return data;
    },
    submitContent: async (id: string) => {
        const { data } = await API.post<Content>(`/content/${id}/submit`);
        return data;
    },
    approveContent: async (id: string, comment?: string) => {
        const { data } = await API.post<Content>(`/content/${id}/approve`, { comment });
        return data;
    },
    rejectContent: async (id: string, comment: string) => {
        const { data } = await API.post<Content>(`/content/${id}/reject`, { comment });
        return data;
    },
    getDashboardSummary: async () => {
        const { data } = await API.get<DashboardSummary>('/dashboard/summary');
        return data;
    }
};

export const userService = {
    getUsers: async () => {
        const { data } = await API.get('/users');
        return data;
    },
    getRoles: async () => {
        const { data } = await API.get('/roles');
        return data;
    },
    createUser: async (payload: { username: string; password?: string; roleId: string }) => {
        const { data } = await API.post('/users', payload);
        return data;
    },
    deleteUser: async (id: string) => {
        const { data } = await API.delete(`/users/${id}`);
        return data;
    },
    deleteRole: async (id: string) => {
        const { data } = await API.delete(`/roles/${id}`);
        return data;
    }
};
