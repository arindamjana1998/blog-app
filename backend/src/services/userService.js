const userRepository = require('../repositories/userRepository');
const AppError = require('../utils/appError');

class UserService {
    async getAllUsers() {
        return await userRepository.findAll();
    }

    async getUserById(id) {
        const user = await userRepository.findById(id);
        if (!user) {
            throw new AppError('User not found', 404);
        }
        return user;
    }

    async createUser(userData) {
        const { username, password, role } = userData;

        // Check if user already exists
        const userExists = await userRepository.findByUsername(username);
        if (userExists) {
            throw new AppError('User already exists', 400);
        }

        // Rule: Exactly ONE Admin in the system
        if (role === 'admin') {
            const adminCount = await userRepository.countByRole('admin');
            if (adminCount > 0) {
                throw new AppError('Exactly ONE Admin is allowed in the system.', 400);
            }
        }

        const user = await userRepository.create({
            username,
            password,
            role: role || 'reviewer' // Default to reviewer
        });

        return {
            _id: user._id,
            username: user.username,
            role: user.role
        };
    }

    async deleteUser(id) {
        const user = await userRepository.findById(id);
        
        if (!user) {
            throw new AppError('User not found', 404);
        }

        // Rule: Admin user cannot be deleted
        if (user.role === 'admin') {
            throw new AppError('The Admin user cannot be deleted.', 403);
        }

        await userRepository.delete(id);
        return { message: 'User removed successfully' };
    }
}

module.exports = new UserService();
