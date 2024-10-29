const express = require('express');
const router = express.Router();
const orderDetailController = require('../../controllers/orderDetail.controller');
const OrderDetail = require('../../models/orderDetail.model');
const Product = require('../../models/products.model');

// Route cho các thao tác CRUD
router.post('/createOrderDetail', orderDetailController.createOrderDetail);       // Create
router.get('/getAllOrderDetails', orderDetailController.getAllOrderDetails);          // Read All
router.get('/getOrderDetailById/:id', orderDetailController.getOrderDetailById);   // Read One
router.post('/updateOrderDetail/:id', orderDetailController.updateOrderDetail);    // Update
router.get('/deleteOrderDetail/:id', orderDetailController.deleteOrderDetail); // Delete

router.get('/createOrderDetail', async (req, res) => {
    try {
        const orderIdParams = req.query.orderId;
        const products = await Product.find();
        console.log(orderIdParams);
        res.render('admin/layoutAdmin', {
            title: 'Create order detail',
            body: 'orderDetails/create_orderDetail',
            products: products,
            orderIdParams: orderIdParams
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/updateOrderDetail/:id', async (req, res) => {
    try {
        const orderIdParams = req.query.orderId;
        const orderDetail = await OrderDetail.findById(req.params.id).populate('orderId productId');
        const products = await Product.find();
        res.render('admin/layoutAdmin', {
            title: 'Update order detail',
            body: 'orderDetails/update_orderDetail',
            orderIdParams: orderIdParams,
            orderDetail: orderDetail,
            products: products
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;