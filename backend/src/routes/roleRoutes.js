const express = require('express');
const router = express.Router();
const { getRoles, createRole } = require('../controllers/roleController');
const { protect } = require('../middlewares/auth');
const { authorize } = require('../middlewares/rbac');

router.route('/')
    .get(protect, authorize('admin'), getRoles)
    .post(protect, authorize('admin'), createRole);

module.exports = router;
