const Role = require("../models/Role");
const User = require("../models/User");

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
    // Rule: Cannot create Admin role manually
    if (slug === 'admin' || name.toLowerCase() === 'admin') {
      return res.status(400).json({ message: "Admin role is reserved and cannot be created manually." });
    }

    const roleExists = await Role.findOne({ $or: [{ name }, { slug }] });
    if (roleExists) {
      return res.status(400).json({ message: "Role already exists" });
    }

    const role = await Role.create({ name, slug, description });
    res.status(201).json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    // Rule: Admin role / System roles cannot be deleted
    if (role.slug === 'admin' || role.isSystemRole) {
      return res.status(403).json({ message: "System roles cannot be deleted." });
    }

    // Rule: Handle deletion of non-admin roles gracefully (Integrity check)
    const usersCount = await User.countDocuments({ role: role._id });
    if (usersCount > 0) {
      return res.status(400).json({ 
        message: `Cannot delete role. ${usersCount} users are currently assigned to it. Please reassign them first.` 
      });
    }

    await role.deleteOne();
    res.json({ message: "Role deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRoles, createRole, deleteRole };
