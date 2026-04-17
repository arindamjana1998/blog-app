const Role = require('../models/Role');

const getRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createRole = async (req, res) => {
    const { name, slug, description } = req.body;
    try {
        const role = await Role.create({ name, slug, description });
        res.status(201).json(role);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getRoles, createRole };
