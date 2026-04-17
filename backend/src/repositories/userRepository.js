const User = require('../models/User');
const Role = require('../models/Role');

class UserRepository {
    async findAll() {
        return await User.find()
            .populate('role')
            .select('-password');
    }

    async findById(id) {
        return await User.findById(id).populate('role');
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

    async countByRole(roleId) {
        return await User.countDocuments({ role: roleId });
    }

    async findRoleBySlug(slug) {
        return await Role.findOne({ slug });
    }

    async findRoleById(id) {
        return await Role.findById(id);
    }
}

module.exports = new UserRepository();
