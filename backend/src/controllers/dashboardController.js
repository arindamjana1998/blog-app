const Content = require('../models/Content');
const User = require('../models/User');
const Role = require('../models/Role');

// @desc    Get dashboard summary
// @route   GET /api/dashboard/summary
// @access  Private
const getDashboardSummary = async (req, res) => {
    try {
        const counts = await Content.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        const summary = {
            DRAFT: 0,
            PENDING_L1: 0,
            PENDING_L2: 0,
            APPROVED: 0,
            REJECTED: 0,
            totalContent: 0,
            totalUsers: await User.countDocuments(),
            totalRoles: await Role.countDocuments()
        };

        counts.forEach(item => {
            summary[item._id] = item.count;
            summary.totalContent += item.count;
        });

        res.json(summary);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDashboardSummary };
