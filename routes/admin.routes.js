const express = require('express');
const router = express.Router();
//route
const roleRouter = require('./modelroutes/roles.routes');
const userRouter = require('./modelroutes/users.routes');
const categoryRouter = require('./modelroutes/categories.routes');
const productRouter = require('./modelroutes/products.routes');
const orderRouter = require('./modelroutes/orders.routes');
const orderDetailRouter = require('./modelroutes/orderDetail.routes');
const providerRouter = require('./modelroutes/providers.routes');
const importRouter = require('./modelroutes/inventoryImport.routes');
const importDetailRouter = require('./modelroutes/inventoryImportDetail.routes');

// model
const User = require('../models/users.model');

// localhost:3000/admin/dashboard
router.get('/dashboard', (req, res) => {
    res.render('admin/layoutAdmin', {
        title: 'Dashboard',
        body: 'dashboard'  // Đường dẫn tương đối từ thư mục 'views'
    });
});
router.get('/productSold', (req, res) => {
    res.render('admin/layoutAdmin', {
        title: 'Product Sold',
        body: 'productSold'  
    })
})
router.get('/profileAdmin', (req, res) => {
    res.render('admin/layoutAdmin', {
        title: 'profileAdmin',
        body: 'profileAdmin'  // Đường dẫn tương đối từ thư mục 'views'
    });
});

router.use('/role', roleRouter);
router.use('/user', userRouter);
router.use('/category', categoryRouter);
router.use('/product', productRouter);
router.use('/order', orderRouter);
router.use('/orderDetail', orderDetailRouter);
router.use('/provider', providerRouter);
router.use('/import', importRouter);
router.use('/importDetail', importDetailRouter);

// chat
router.get('/chat', async (req, res) => {
    const users = await User.find();
    res.render('admin/layoutAdmin', {
        title: 'Chat',
        body: 'chatAdmin',
        users: users
    });
});

module.exports = router;