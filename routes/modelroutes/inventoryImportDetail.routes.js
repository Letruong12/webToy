const express = require('express');
const router = express.Router();
const importDetailController = require('../../controllers/inventoryImportDetail.controller');
const Product = require('../../models/products.model');
const ImportDetail = require('../../models/inventoryImportDetail.model');

// Route cho các thao tác CRUD
router.post('/createImportDetail', importDetailController.createImportDetail);       // Create
router.get('/getAllImportDetails', importDetailController.getAllImportDetails);          // Read All
router.get('/getImportDetailById/:id', importDetailController.getImportDetailById);   // Read One
router.post('/updateImportDetail/:id', importDetailController.updateImportDetail);    // Update
router.get('/deleteImportDetail/:id', importDetailController.deleteImportDetail); // Delete

router.get('/createImportDetail', async (req, res) => {
    try {
        const importIdQuery = req.query.importId;
        const products = await Product.find();
        console.log('vao create');
        res.status(201).render('admin/layoutAdmin', {
            title: 'Create import detail',
            body: 'inventoryImportDetails/create_importDetail',
            products: products,
            importIdQuery: importIdQuery
        });
    } catch (error) {
        res.status.json({ message: error.message });
    }
});

router.get('/updateImportDetail/:id', async (req, res) => {
    try {
        const importIdQuery = req.query.importId;
        const importDetail = await ImportDetail.findById(req.params.id).populate('importId productId');
        const products = await Product.find();
        res.status(201).render('admin/layoutAdmin', {
            title: 'Update import detail',
            body: 'inventoryImportDetails/update_importDetail',
            products: products,
            importIdQuery: importIdQuery,
            importDetail: importDetail
        });
    } catch (error) {
        res.status.json({ message: error.message });
    }
});

module.exports = router;