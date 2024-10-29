const express = require('express');
const router = express.Router();
const providerController = require('../../controllers/provider.controller');
const Provider = require('../../models/providers.model');

// Route cho các thao tác CRUD
router.post('/createProvider', providerController.createProvider);       // Create
router.get('/getAllProviders', providerController.getAllProviders);          // Read All
router.get('/getProviderById/:id', providerController.getProviderById);   // Read One
router.post('/updateProvider/:id', providerController.updateProvider);    // Update
router.get('/deleteProvider/:id', providerController.deleteProvider); // Delete

router.get('/createProvider', async (req, res) => {
    try {
        res.render('admin/layoutAdmin', {
            title: 'create provider',
            body: 'providers/create_provider'
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/updateProvider/:id', async (req, res) => {
    try {
        const provider = await Provider.findById(req.params.id);
        res.render('admin/layoutAdmin', {
            title: 'update provider',
            body: 'providers/update_provider',
            provider: provider
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

module.exports = router;