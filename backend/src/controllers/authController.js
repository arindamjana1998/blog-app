const authService = require("../services/authService");

const loginUser = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const userData = await authService.login(username, password);
    res.json(userData);
  } catch (error) {
    next(error);
  }
};

module.exports = { loginUser };
