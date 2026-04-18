const Content = require('../models/Content');
const User = require('../models/User');

class DashboardRepository {
    async getContentStatusCounts() {
        return await Content.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);
    }

    async getUserCount() {
        return await User.countDocuments();
    }

    async getRoleCount() {
        return 2; // Fixed roles: admin, reviewer
    }
}

module.exports = new DashboardRepository();
