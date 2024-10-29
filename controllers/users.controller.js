const User = require('../models/users.model');
const Role = require('../models/roles.model');
const bcryptjs = require('bcryptjs');

let userCreationStatus = null;
// Create a new user
exports.createUser = async (req, res) => {
    try {
        const { name, email, age, password, key_role } = req.body;
        console.log(name, email, age, password, key_role);
        const role = await Role.findOne({ name: key_role });
        const hashedPassword = await bcryptjs.hash(password, 10);
        const user = await new User({
            name: name,
            email: email,
            age: age,
            password: hashedPassword,
            idRole: role._id
        })
        console.log(user)
        await user.save();
        userCreationStatus = 'success';
        res.status(201).redirect('/admin/user/getAllUsers');
    }
    catch (error) {
        userCreationStatus = 'failure';
        res.status(400).json({ error: error.message });
    }
};

// Get all user
exports.getAllUsers = async (req, res) => {
    console.log('ha')
    try {
        // kiểm tra trạng thái tạo user
        const statusMessage = userCreationStatus === 'success'
            ? 'success'
            : 'fail';
        userCreationStatus = null;
        console.log(User)
        const users = await User.find().populate('idRole', 'name'); 
        console.log(users);
        res.status(200).render('admin/layoutAdmin', {
            title: 'all users',
            body: 'users/listUsers',
            users: users,
            statusMessage: statusMessage
        });
    } catch (error) {
        console.error('Lỗi khi truy vấn người dùng:', error);
        res.status(500).json({ message: 'Lỗi server', error });
    }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('idRole', 'name');
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a user
exports.updateUser = async (req, res) => {
    try {
        const { name, email, age, password, key_role } = req.body;
        const role = await Role.findOne({ name: key_role });
        if (!role) {
            return res.status(400).json({ message: 'Vai trò không tồn tại' });
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            name,
            email,
            age,
            password,
            idRole: role._id 
        }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ message: 'Cập nhật thành công', user: updatedUser });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a user
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}