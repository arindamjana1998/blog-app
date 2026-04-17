const express = require('express');
const router = express.Router();
const {
    getContents,
    getContentById,
    createContent,
    updateContent,
    submitContent,
    approveContent,
    rejectContent
} = require('../controllers/contentController');
const { protect } = require('../middlewares/auth');
const { authorize } = require('../middlewares/rbac');

router.route('/')
    .get(protect, getContents)
    .post(protect, authorize('admin', 'creator'), createContent);

router.route('/:id')
    .get(protect, getContentById)
    .put(protect, authorize('admin', 'creator'), updateContent);

router.post('/:id/submit', protect, authorize('admin', 'creator'), submitContent);
router.post('/:id/approve', protect, authorize('reviewer_l1', 'reviewer_l2'), approveContent);
router.post('/:id/reject', protect, authorize('reviewer_l1', 'reviewer_l2'), rejectContent);

module.exports = router;
