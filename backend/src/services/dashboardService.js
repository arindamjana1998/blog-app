const dashboardRepository = require('../repositories/dashboardRepository');

class DashboardService {
    async getSummary() {
        const counts = await dashboardRepository.getContentStatusCounts();
        const totalUsers = await dashboardRepository.getUserCount();
        const totalRoles = await dashboardRepository.getRoleCount();

        const summary = {
            draft: 0,
            pending_review_level_1: 0,
            pending_review_level_2: 0,
            approved: 0,
            rejected: 0,
            published: 0,
            totalContent: 0,
            totalUsers,
            totalRoles
        };

        counts.forEach(item => {
            if (summary.hasOwnProperty(item._id)) {
                summary[item._id] = item.count;
            }
            summary.totalContent += item.count;
        });

        return summary;
    }
}

module.exports = new DashboardService();
