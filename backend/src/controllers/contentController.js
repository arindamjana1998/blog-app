const Content = require('../models/Content');

// @desc    Get all content
// @route   GET /api/content
// @access  Private
const getContents = async (req, res) => {
    try {
        let query = {};
        // If not admin, they might only see what they created or what they can review
        // But for simplicity, let's allow viewing all to reviewers and admins
        const contents = await Content.find(query)
            .populate('createdBy', 'username')
            .populate('updatedBy', 'username')
            .sort({ updatedAt: -1 });
        res.json(contents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get content by ID
// @route   GET /api/content/:id
// @access  Private
const getContentById = async (req, res) => {
    try {
        const content = await Content.findById(req.params.id)
            .populate('createdBy', 'username')
            .populate('updatedBy', 'username')
            .populate('approvalHistory.actedBy', 'username');
        if (content) {
            res.json(content);
        } else {
            res.status(404).json({ message: 'Content not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create content
// @route   POST /api/content
// @access  Private (Creator/Admin)
const createContent = async (req, res) => {
    const { title, description } = req.body;
    try {
        const content = await Content.create({
            title,
            description,
            createdBy: req.user._id,
            status: 'DRAFT',
            currentStep: 0,
            isEditable: true
        });
        res.status(201).json(content);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update content
// @route   PUT /api/content/:id
// @access  Private (Creator/Admin)
const updateContent = async (req, res) => {
    try {
        const content = await Content.findById(req.params.id);

        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }

        if (!content.isEditable) {
            return res.status(400).json({ message: 'Content is not editable in current status' });
        }

        content.title = req.body.title || content.title;
        content.description = req.body.description || content.description;
        content.updatedBy = req.user._id;

        // If it was rejected, editing it might reset it to DRAFT or prepare it for resubmission
        if (content.status === 'REJECTED') {
            content.status = 'DRAFT';
            content.version += 1;
        }

        const updatedContent = await content.save();
        res.json(updatedContent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Submit content for approval
// @route   POST /api/content/:id/submit
// @access  Private (Creator/Admin)
const submitContent = async (req, res) => {
    try {
        const content = await Content.findById(req.params.id);

        if (!content) return res.status(404).json({ message: 'Content not found' });
        if (!['DRAFT', 'REJECTED'].includes(content.status)) {
            return res.status(400).json({ message: 'Only DRAFT or REJECTED content can be submitted' });
        }

        content.status = 'PENDING_L1';
        content.currentStep = 1;
        content.isEditable = false;
        
        content.approvalHistory.push({
            step: 0,
            action: 'SUBMITTED',
            actedBy: req.user._id,
            actedAt: Date.now()
        });

        await content.save();
        res.json(content);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Approve content
// @route   POST /api/content/:id/approve
// @access  Private (L1/L2 Reviewer)
const approveContent = async (req, res) => {
    const { comment } = req.body;
    try {
        const content = await Content.findById(req.params.id);
        if (!content) return res.status(404).json({ message: 'Content not found' });

        const userRole = req.user.role.slug;

        if (content.status === 'PENDING_L1' && userRole === 'reviewer_l1') {
            content.status = 'PENDING_L2';
            content.currentStep = 2;
            content.approvalHistory.push({
                step: 1,
                action: 'APPROVED',
                comment,
                actedBy: req.user._id
            });
        } else if (content.status === 'PENDING_L2' && userRole === 'reviewer_l2') {
            content.status = 'APPROVED';
            content.currentStep = 3;
            content.isEditable = false;
            content.approvalHistory.push({
                step: 2,
                action: 'APPROVED',
                comment,
                actedBy: req.user._id
            });
        } else {
            return res.status(403).json({ message: 'Not authorized to approve at this stage' });
        }

        await content.save();
        res.json(content);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reject content
// @route   POST /api/content/:id/reject
// @access  Private (L1/L2 Reviewer)
const rejectContent = async (req, res) => {
    const { comment } = req.body;
    try {
        const content = await Content.findById(req.params.id);
        if (!content) return res.status(404).json({ message: 'Content not found' });

        const userRole = req.user.role.slug;
        const currentStep = content.currentStep;

        if ((currentStep === 1 && userRole === 'reviewer_l1') || (currentStep === 2 && userRole === 'reviewer_l2')) {
            content.status = 'REJECTED';
            content.isEditable = true;
            content.approvalHistory.push({
                step: currentStep,
                action: 'REJECTED',
                comment,
                actedBy: req.user._id
            });
        } else {
            return res.status(403).json({ message: 'Not authorized to reject at this stage' });
        }

        await content.save();
        res.json(content);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getContents,
    getContentById,
    createContent,
    updateContent,
    submitContent,
    approveContent,
    rejectContent
};
