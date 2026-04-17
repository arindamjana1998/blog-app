const User = require('../models/User');
const Role = require('../models/Role');

const getUsers = async (req, res) => {
    try {
        const users = await User.find().populate('role').select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createUser = async (req, res) => {
    const { username, password, roleId } = req.body;
    try {
        const userExists = await User.findOne({ username });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const targetRole = await Role.findById(roleId);
        if (!targetRole) return res.status(404).json({ message: 'Role not found' });

        // Rule: Exactly ONE Admin in the system at all times
        if (targetRole.slug === 'admin') {
            const adminExists = await User.findOne({ role: targetRole._id });
            if (adminExists) {
                return res.status(400).json({ message: 'Exactly ONE Admin is allowed in the system.' });
            }
        }

        const user = await User.create({
            username,
            password,
            role: roleId
        });
        res.status(201).json({ _id: user._id, username: user.username, role: user.role });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('role');
        if (user) {
            // Rule: Admin user cannot be deleted under any circumstances
            if (user.role && user.role.slug === 'admin') {
                return res.status(403).json({ message: 'The Admin user cannot be deleted.' });
            }
            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getUsers, createUser, deleteUser };
