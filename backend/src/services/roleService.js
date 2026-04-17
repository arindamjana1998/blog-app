const roleRepository = require('../repositories/roleRepository');
const AppError = require('../utils/appError');

class RoleService {
    async getAllRoles() {
        return await roleRepository.findAll();
    }

    async createRole(roleData) {
        const { name, slug, description } = roleData;

        // Rule: Cannot create Admin role manually
        if (slug === 'admin' || name.toLowerCase() === 'admin') {
            throw new AppError('Admin role is reserved and cannot be created manually.', 400);
        }

        const roleExists = await roleRepository.findOne({ $or: [{ name }, { slug }] });
        if (roleExists) {
            throw new AppError('Role already exists', 400);
        }

        return await roleRepository.create({ name, slug, description });
    }

    async deleteRole(id) {
        const role = await roleRepository.findById(id);
        if (!role) {
            throw new AppError('Role not found', 404);
        }

        // Rule: Admin role / System roles cannot be deleted
        if (role.slug === 'admin' || role.isSystemRole) {
            throw new AppError('System roles cannot be deleted.', 403);
        }

        // Integrity check: fail if users are assigned to this role
        const usersCount = await roleRepository.countUsersWithRole(role._id);
        if (usersCount > 0) {
            throw new AppError(`Cannot delete role. ${usersCount} users are currently assigned to it. Please reassign them first.`, 400);
        }

        await roleRepository.deleteById(id);
        return { message: 'Role deleted successfully.' };
    }
}

module.exports = new RoleService();
