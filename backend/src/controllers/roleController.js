const roleService = require('../services/roleService');

const getRoles = async (req, res, next) => {
    try {
        const roles = await roleService.getAllRoles();
        res.json(roles);
    } catch (error) {
        next(error);
    }
};

const createRole = async (req, res, next) => {
    try {
        const role = await roleService.createRole(req.body);
        res.status(201).json(role);
    } catch (error) {
        next(error);
    }
};

const deleteRole = async (req, res, next) => {
    try {
        const result = await roleService.deleteRole(req.params.id);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

module.exports = { getRoles, createRole, deleteRole };

