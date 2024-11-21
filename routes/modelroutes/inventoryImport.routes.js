const express = require('express');
const router = express.Router();
const importController = require('../../controllers/inventoryImport.controller');
const Provider = require('../../models/providers.model');
const InventoryImport = require('../../models/inventoryImport.model');

// Route cho các thao tác CRUD
router.post('/createImport', importController.createImport);       // Create
router.get('/getAllImports', importController.getAllImports);          // Read All
router.get('/getImportById/:id', importController.getImportById);   // Read One
router.post('/updateImport/:id', importController.updateImport);    // Update
router.get('/deleteImport/:id', importController.deleteImport); // Delete

router.get('/createImport', async (req, res) => {
    try {
        const providers = await Provider.find();
        res.status(201).render('admin/layoutAdmin', {
            title: 'Create import',
            body: 'inventoryImports/create_import',
            providers: providers
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/updateImport/:id', async (req, res) => {
    try {
        const providers = await Provider.find();
        const inventoryImport = await InventoryImport.findById(req.params.id).populate('providerId');
        res.status(201).render('admin/layoutAdmin', {
            title: 'Update import',
            body: 'inventoryImports/update_import',
            providers: providers,
            inventoryImport: inventoryImport
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.get('/updateStatus/:id', importController.updateStatus);

module.exports = router;