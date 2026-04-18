const User = require("../models/User");

class UserRepository {
  async findAll() {
    return await User.find().select("-password");
  }

  async findById(id) {
    return await User.findById(id);
  }

  async findByUsername(username) {
    return await User.findOne({ username });
  }

  async create(userData) {
    return await User.create(userData);
  }

  async delete(id) {
    return await User.findByIdAndDelete(id);
  }

  async countByRole(role) {
    return await User.countDocuments({ role });
  }
}

module.exports = new UserRepository();
