export type RoleSlug = 'admin' | 'reviewer' | 'creator';

export interface User {
    _id: string;
    username: string;
    role: RoleSlug;
}

export interface ApprovalHistory {
    step: number;
    action: 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'PUBLISHED' | 'UNPUBLISHED';
    comment?: string;
    actedBy: {
        _id: string;
        username: string;
    };
    actedAt: string;
}

export type ContentStatus = 'draft' | 'pending_review_level_1' | 'pending_review_level_2' | 'rejected' | 'approved' | 'published';

export interface Content {
    _id: string;
    title: string;
    description: string;
    status: ContentStatus;
    currentStep: string;
    createdBy: {
        _id: string;
        username: string;
    };
    updatedBy?: {
        _id: string;
        username: string;
    };
    version: number;
    approvalHistory: ApprovalHistory[];
    createdAt: string;
    updatedAt: string;
}

export interface DashboardSummary {
    draft: number;
    pending_review_level_1: number;
    pending_review_level_2: number;
    rejected: number;
    approved: number;
    published: number;
    totalContent: number;
    totalUsers: number;
    totalRoles: number;
}
