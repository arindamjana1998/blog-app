const dashboardService = require("../services/dashboardService");

const getDashboardSummary = async (req, res, next) => {
  try {
    const { id, role } = req.user;
    const summary = await dashboardService.getSummary(id, role);
    res.json(summary);
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardSummary };
