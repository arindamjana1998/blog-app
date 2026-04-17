const dashboardRepository = require('../repositories/dashboardRepository');

class DashboardService {
    async getSummary() {
        const counts = await dashboardRepository.getContentStatusCounts();
        const totalUsers = await dashboardRepository.getUserCount();
        const totalRoles = await dashboardRepository.getRoleCount();

        const summary = {
            DRAFT: 0,
            PENDING_L1: 0,
            PENDING_L2: 0,
            APPROVED: 0,
            REJECTED: 0,
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
