const Content = require('../models/Content');
const User = require('../models/User');
const Role = require('../models/Role');

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
        return await Role.countDocuments();
    }
}

module.exports = new DashboardRepository();
