const express = require('express');
const router = express.Router();
// model routes
const User = require('../models/users.model');
const Product = require('../models/products.model');
const Order = require('../models/orders.model');
const OrderDetail = require('../models/orderDetail.model');

const adminRouter = require('./admin.routes');
const { authenticateToken, login, signUp, loginAdmin } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/authorize');
// router cấp 1

// cilent
//router.use('/user', authenticateToken, authorizeRoles('normal', 'admin'), userRouter);

    // login
router.get('/auth', (req, res) => { 
    res.render('login');
});
router.post('/login', login);
router.post('/signup', signUp);

// admin
router.use('/admin', authenticateToken, authorizeRoles('admin'), adminRouter);
router.get('/adminLogin', (req, res) => {
    res.render('admin/loginAdmin');
});
router.post('/adminLogin', login);

// router.use('/admin', authenticateToken, authorizeRoles('admin'), (req, res) => {
//     res.json({
//         message: "Welcome to admin dashboard1"
//     })
// });


// central
// dashboard
router.get('/dashboard', authenticateToken, authorizeRoles('normal', 'admin'), async (req, res) => {
    try {
        console.log('dashboard client')
        console.log(req.user);
        const user = await User.findById(req.user.userId);
        const products = await Product.find();
        console.log(user);
        res.status(201).render('layout', {
            title: 'Dashboard',
            body: 'dashboard',  // Đường dẫn tương đối của file dashboard.ejs
            user: user,
            products: products
        });
    } catch (error) {
        console.log('error: ', error.message);
    }
    
});
router.get('/detail/:id', authenticateToken, authorizeRoles('normal', 'admin'), async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        res.status(201).render('layout', {
            title: 'Detail',
            body: 'details',
            product: product
        });   
    } catch (error) {
        console.log(error.message);
    }
});
const Cart = require('../controllers/cart');
router.get('/cart', authenticateToken, authorizeRoles('normal', 'admin'), Cart.getCart);
router.get('/cart/remove/:id', authenticateToken, authorizeRoles('normal', 'admin'), Cart.removeCart);
router.get('/cart/add/:id', authenticateToken, authorizeRoles('normal', 'admin'), Cart.addCart);
router.post('/cart/checkout', authenticateToken, authorizeRoles('normal', 'admin'), Cart.checkCart);

router.get('/profile', authenticateToken, authorizeRoles('normal', 'admin'), async (req, res) => {
    const user = await User.findById(req.user.userId);
    const orders = await Order.find({ userId: req.user.userId });
    const orderWithTotal = await Promise.all(
        orders.map(async (order) => {
            try {
                const orderDetails = await OrderDetail.find({ orderId: order._id }).populate('productId');
                const total = orderDetails.reduce((total, detail) => {
                    return total + (detail.quantity * detail.productId.price);
                }, 0);
                return {
                    ...order._doc,
                    totalAmount: total
                }
            } catch (error) {
                console.log(`Error calculating total for order ID ${order._id}: `, error.message);
                return {
                    ...order._doc,
                    totalAmount: 0,
                    errorMessage: 'Error calculating total'
                }
            }
        })
    );
    const ordersUser = await Order.find({ userId: req.user.userId });
    res.status(201).render('layout', {
        title: 'profile',
        body: 'profile',
        user: user,
        orders: orderWithTotal
    });
});

// logout
router.get('/logout', (req, res) => {
    res.cookie('authToken', '', { maxAge: 0 });
    res.cookie('cart', '', { maxAge: 0 });
    res.redirect('/auth')
    
});
router.get('/logoutAdmin', (req, res) => {
    res.cookie('authToken', '', { maxAge: 0 });
    res.redirect('/adminLogin?message=success');
});
// page error
router.get('/pageError', (req, res) => {
    res.render('pageError', {
        message: "PAGE NOT FOUND !",
        link: '/admin/dashboard',
        content: 'Back to home'
    });
});

// chart test
const chart = require('../controllers/charts.controller');
router.get('/chart', chart.getChartImportData);
router.get('/chartProduct', chart.getProductsSold);
router.post('/chartProduct', chart.getProductsSold);
router.get('/chartProductBought', chart.getProductsBought);

// socket
router.get('/chat', (req, res) => {
    res.render('chat');
})


const pay = require('../controllers/pay');
// payment
router.post('/payment', pay.payment);
router.post('/callback', pay.callBack);
router.post('/check-status-order/:id', pay.cherckStatusOrder);


module.exports = router;