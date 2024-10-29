const express = require('express');
const router = express.Router();
const roleController = require('../../controllers/roles.controller')

// Route cho các thao tác CRUD
router.post('/createRole', roleController.createRole);       // Create
router.get('/getAllRoles', roleController.getAllRoles);          // Read All
router.get('/getRoleById/:id', roleController.getRoleById);   // Read One
router.put('/updateRole/:id', roleController.updateRole);    // Update
router.delete('/deleteRole/:id', roleController.deleteRole); // Delete


module.exports = router;