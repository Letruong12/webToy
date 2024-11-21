const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/orders.controller');
const User = require('../../models/users.model');
const Order = require('../../models/orders.model');

// Route cho các thao tác CRUD
router.post('/createOrder', orderController.createOrder);       // Create
router.get('/getAllOrders', orderController.getAllOrders);          // Read All
router.get('/getOrderById/:id', orderController.getOrderById);   // Read One
router.post('/updateOrder/:id', orderController.updateOrder);    // Update
router.get('/deleteOrder/:id', orderController.deleteOrder); // Delete

router.get('/createOrder', async (req, res) => {
    try {
        const users = await User.find();
        res.render('admin/layoutAdmin', {
            title: 'Create order',
            body: 'orders/create_order',
            users: users
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/updateOrder/:id', async (req, res) => {
    try {
        const users = await User.find();
        const order = await Order.findById(req.params.id).populate('userId');
        res.render('admin/layoutAdmin', {
            title: 'Update order',
            body: 'orders/update_order',
            order: order,
            users: users
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/updateStatus/:id', orderController.updateStatus);

module.exports = router;