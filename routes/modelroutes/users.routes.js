const express = require('express');
const router = express.Router();
const userController = require('../../controllers/users.controller')

// Route cho các thao tác CRUD
router.post('/createUser', userController.createUser);       // Create
router.get('/getAllUsers', userController.getAllUsers);          // Read All
router.get('/getUserById/:id', userController.getUserById);   // Read One
router.put('/updateUser/:id', userController.updateUser);    // Update
router.delete('/deleteUser/:id', userController.deleteUser); // Delete
router.get('/createUser', (req, res) => {
    res.render('admin/layoutAdmin', {
        title: 'create user',
        body: 'users/create_user'
    })
})
router.get('/test', (req, res, next) => {
    res.render('users/create_user');
});

module.exports = router;