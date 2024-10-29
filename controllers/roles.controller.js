const Role = require('../models/roles.model')

// Create a new role
exports.createRole = async (req, res) => {
    try {
        const role = await new Role(req.body)
        console.log(role)
        await role.save();
        res.status(201).json(role);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all role
exports.getAllRoles = async (req, res) => {
    console.log('ha')
    try {
        const roles = await Role.find();
        console.log(roles);
        res.status(200).render('admin/layoutAdmin', {
            title: 'all roles',
            body: 'roles/listRoles',
            roles: roles
        });
    } catch (error) {
        console.error('Lỗi khi truy vấn người dùng:', error);
        res.status(500).json({ message: 'Lỗi server', error });
    }
};

// Get a single role by ID
exports.getRoleById = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) {
            return res.status(404).json({ error: "Role not found" });
        }
        res.json(role);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a role
exports.updateRole = async (req, res) => {
    try {
        const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!role) {
            return res.status(404).json({ error: "role not found" });
        }
        res.json(role);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a role
exports.deleteRole = async (req, res) => {
    try {
        const role = await Role.findByIdAndDelete(req.params.id);
        if (!role) {
            return res.status(404).json({ error: 'role not found' });
        }
        res.json({ message: 'role deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}