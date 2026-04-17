const Role = require('../models/Role');
const User = require('../models/User');

class RoleRepository {
    async findAll() {
        return await Role.find();
    }

    async findById(id) {
        return await Role.findById(id);
    }

    async findOne(query) {
        return await Role.findOne(query);
    }

    async create(roleData) {
        return await Role.create(roleData);
    }

    async deleteById(id) {
        return await Role.findByIdAndDelete(id);
    }

    async countUsersWithRole(roleId) {
        return await User.countDocuments({ role: roleId });
    }
}

module.exports = new RoleRepository();
