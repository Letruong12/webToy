const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/categories.controller')

// Route cho các thao tác CRUD
router.post('/createCategory', categoryController.createCategory);       // Create
router.get('/getAllCategories', categoryController.getAllCategories);          // Read All
router.get('/getCategoryById/:id', categoryController.getCategoryById);   // Read One
router.put('/updateCategory/:id', categoryController.updateCategory);    // Update
router.delete('/deleteCategory/:id', categoryController.deleteCategory); // Delete

router.get('/createCategory', (req, res) => {
    res.render('admin/layoutAdmin', {
        title: 'create category',
        body: 'categories/create_category'
    })
})

module.exports = router;