const contentRepository = require('../repositories/contentRepository');
const AppError = require('../utils/appError');

class ContentService {
    async getAllContents() {
        return await contentRepository.findAll();
    }

    async getContentById(id) {
        const content = await contentRepository.findById(id);
        if (!content) {
            throw new AppError('Content not found', 404);
        }
        return content;
    }

    async createContent(data, userId) {
        const { title, description } = data;
        return await contentRepository.create({
            title,
            description,
            createdBy: userId,
            status: 'DRAFT',
            currentStep: 0,
            isEditable: true
        });
    }

    async updateContent(id, data, userId) {
        const content = await contentRepository.findById(id);
        if (!content) throw new AppError('Content not found', 404);
        if (!content.isEditable) throw new AppError('Content is not editable in current status', 400);

        const updateData = {
            title: data.title || content.title,
            description: data.description || content.description,
            updatedBy: userId
        };

        if (content.status === 'REJECTED') {
            updateData.status = 'DRAFT';
            updateData.version = content.version + 1;
        }

        return await contentRepository.update(id, updateData);
    }

    async submitContent(id, userId) {
        const content = await contentRepository.findById(id);
        if (!content) throw new AppError('Content not found', 404);
        
        if (!['DRAFT', 'REJECTED'].includes(content.status)) {
            throw new AppError('Only DRAFT or REJECTED content can be submitted', 400);
        }

        content.status = 'PENDING_L1';
        content.currentStep = 1;
        content.isEditable = false;
        content.approvalHistory.push({
            step: 0,
            action: 'SUBMITTED',
            actedBy: userId,
            actedAt: Date.now()
        });

        await contentRepository.save(content);
        return await contentRepository.findById(id);
    }

    async approveContent(id, userId, userRole, comment) {
        const content = await contentRepository.findById(id);
        if (!content) throw new AppError('Content not found', 404);

        if (content.status === 'PENDING_L1' && userRole === 'reviewer_l1') {
            content.status = 'PENDING_L2';
            content.currentStep = 2;
            content.approvalHistory.push({
                step: 1,
                action: 'APPROVED',
                comment,
                actedBy: userId
            });
        } else if (content.status === 'PENDING_L2' && userRole === 'reviewer_l2') {
            content.status = 'APPROVED';
            content.currentStep = 3;
            content.isEditable = false;
            content.approvalHistory.push({
                step: 2,
                action: 'APPROVED',
                comment,
                actedBy: userId
            });
        } else {
            throw new AppError('Not authorized to approve at this stage', 403);
        }

        await contentRepository.save(content);
        return await contentRepository.findById(id);
    }

    async rejectContent(id, userId, userRole, comment) {
        const content = await contentRepository.findById(id);
        if (!content) throw new AppError('Content not found', 404);

        const currentStep = content.currentStep;

        if ((currentStep === 1 && userRole === 'reviewer_l1') || (currentStep === 2 && userRole === 'reviewer_l2')) {
            content.status = 'REJECTED';
            content.isEditable = true;
            content.approvalHistory.push({
                step: currentStep,
                action: 'REJECTED',
                comment,
                actedBy: userId
            });
        } else {
            throw new AppError('Not authorized to reject at this stage', 403);
        }

        await contentRepository.save(content);
        return await contentRepository.findById(id);
    }
}

module.exports = new ContentService();
