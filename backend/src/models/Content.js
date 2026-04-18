const mongoose = require('mongoose');

const approvalHistorySchema = new mongoose.Schema({
    step: {
        type: Number, // 1 for L1, 2 for L2
        required: true
    },
    action: {
        type: String, // SUBMITTED, APPROVED, REJECTED
        required: true
    },
    comment: String,
    actedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    actedAt: {
        type: Date,
        default: Date.now
    }
});

const contentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'pending_review_level_1', 'pending_review_level_2', 'rejected', 'approved', 'published'],
        default: 'draft'
    },
    currentStep: {
        type: String,
        enum: ['draft', 'review_level_1', 'review_level_2', 'approved', 'rejected', 'published'],
        default: 'draft'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    version: {
        type: Number,
        default: 1
    },
    approvalHistory: [approvalHistorySchema]
}, { timestamps: true });

module.exports = mongoose.model('Content', contentSchema);
