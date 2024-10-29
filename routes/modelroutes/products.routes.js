const express = require('express');
const router = express.Router();
const productController = require('../../controllers/products.controller');
const Category = require('../../models/categories.model');
const Product = require('../../models/products.model');
// Route cho các thao tác CRUD
router.post('/createProduct', productController.createProduct);       // Create
router.get('/getAllProducts', productController.getAllProducts);          // Read All
router.get('/getProductById/:id', productController.getProductById);   // Read One
router.post('/updateProduct/:id', productController.updateProduct);    // Update
router.get('/deleteProduct/:id', productController.deleteProduct); // Delete

router.get('/createProduct', async (req, res) => {
    try {
        const categories = await Category.find();
        res.render('admin/layoutAdmin', {
            title: 'create product',
            body: 'products/create_product',
            categories: categories
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/updateProduct/:id', async (req, res) => {
    try {
        const categories = await Category.find();
        const product = await Product.findById(req.params.id).populate('categoryId');
        res.render('admin/layoutAdmin', {
            title: 'update product',
            body: 'products/update_product',
            product: product,
            categories: categories
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

module.exports = router;