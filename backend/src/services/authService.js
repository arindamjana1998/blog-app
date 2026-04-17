const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const AppError = require('../utils/appError');

class AuthService {
    async login(username, password) {
        const user = await userRepository.findByUsername(username);

        if (!user) {
            throw new AppError('Invalid username or password', 401);
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            throw new AppError('Invalid username or password', 401);
        }

        // Populate role if not already populated (findByUsername might not have populated it)
        const populatedUser = await user.populate('role');

        return {
            _id: populatedUser._id,
            username: populatedUser.username,
            role: populatedUser.role,
            token: this.generateToken(populatedUser._id)
        };
    }

    generateToken(id) {
        return jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });
    }
}

module.exports = new AuthService();
