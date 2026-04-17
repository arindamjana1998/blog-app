export type RoleSlug = 'admin' | 'creator' | 'reviewer_l1' | 'reviewer_l2';

export interface Role {
    _id: string;
    name: string;
    slug: RoleSlug;
    description?: string;
}

export interface User {
    _id: string;
    username: string;
    role: Role;
}

export interface ApprovalHistory {
    step: number;
    action: 'SUBMITTED' | 'APPROVED' | 'REJECTED';
    comment?: string;
    actedBy: {
        _id: string;
        username: string;
    };
    actedAt: string;
}

export type ContentStatus = 'DRAFT' | 'PENDING_L1' | 'PENDING_L2' | 'APPROVED' | 'REJECTED';

export interface Content {
    _id: string;
    title: string;
    description: string;
    status: ContentStatus;
    currentStep: number;
    isEditable: boolean;
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
    DRAFT: number;
    PENDING_L1: number;
    PENDING_L2: number;
    APPROVED: number;
    REJECTED: number;
    totalContent: number;
    totalUsers: number;
    totalRoles: number;
}
