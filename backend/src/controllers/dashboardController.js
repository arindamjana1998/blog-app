const dashboardService = require('../services/dashboardService');

const getDashboardSummary = async (req, res, next) => {
    try {
        const summary = await dashboardService.getSummary();
        res.json(summary);
    } catch (error) {
        next(error);
    }
};

module.exports = { getDashboardSummary };

