const Content = require('../models/Content');
const User = require('../models/User');

class DashboardRepository {
    async getContentStatusCounts(filter = {}) {
        const pipeline = [];
        
        if (Object.keys(filter).length > 0) {
            pipeline.push({ $match: filter });
        }
        
        pipeline.push({
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        });

        return await Content.aggregate(pipeline);
    }

    async getUserCount() {
        return await User.countDocuments();
    }

    async getRoleCount() {
        return 2; // Fixed roles: admin, reviewer
    }
}

module.exports = new DashboardRepository();
