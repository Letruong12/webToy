const Order = require('../models/orders.model');
const User = require('../models/users.model');
const OrderDetail = require('../models/orderDetail.model');

let orderCreationStatus = null;
// Create a new order
exports.createOrder = async (req, res) => {
    try {
        console.log(req.body.status, req.body.isPaid, req.body.userName);
        const user = await User.findOne({ name: req.body.userName });
        if (!user) { 
            return res.status(404).json({ message: 'User not found' });
        }
        const newOrder = new Order({
            status: req.body.status,
            isPaid: (req.body.isPaid == "True"),
            userId: user._id
        });
        await newOrder.save();
        orderCreationStatus = 'success';
        res.status(201).redirect('/admin/order/getAllOrders');
    } catch (error) {
        orderCreationStatus = 'failure';
        res.status(500).json({ message: error.message });
    }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const statusMessage = orderCreationStatus === 'success'
            ? 'success'
            : 'fail';
        orderCreationStatus = null;
        let orders = await Order.find().populate('userId');

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

        console.log(orderWithTotal);

        res.status(200).render('admin/layoutAdmin', {
            title: 'All orders',
            body: 'orders/listOrders',
            orders: orderWithTotal,
            statusMessage: statusMessage
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get order by ID
// -- truyền _id của order sang cho bên orderDetail
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('userId');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update order
exports.updateOrder = async (req, res) => {
    try {
        console.log(req.body.status, req.body.isPaid, req.body.userName);
        const user = await User.findOne({ name: req.body.userName });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, 
            {
                status: req.body.status,
                isPaid: (req.body.isPaid == "True"),
                userId: user._id
            }, { new: true });
        res.status(200).redirect('/admin/order/getAllOrders');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete order
exports.deleteOrder = async (req, res) => {
    try {
        console.log(req.params.id);
        const orderDetails = await OrderDetail.find({ orderId: req.params.id });
        if (orderDetails.length > 0) {
            res.status(200).redirect(`/admin/orderDetail/getAllOrderDetails?orderId=${req.params.id}&key_delete=true`);
        }
        else {
            await Order.findByIdAndDelete(req.params.id);
            res.status(200).redirect('/admin/order/getAllOrders');
        }
        // nhớ xóa cả orderDetail -- làm sau
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
