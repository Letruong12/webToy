const OrderDetail = require('../models/orderDetail.model');
const Product = require('../models/products.model');

let orderDetailCreationStatus = null;

// Create a new order detail
exports.createOrderDetail = async (req, res) => {
    try {
        console.log(req.body.quantity, req.query.orderId, req.body.productName);
        const product = await Product.findOne({ name: req.body.productName });
        if (!product) { 
            return res.status(404).json({ message: 'Product not found' });
        }
        const newOrderDetail = new OrderDetail({
            quantity: req.body.quantity,
            orderId: req.query.orderId,
            productId: product._id
        });
        await newOrderDetail.save();
        const newQuantity = product.quantity - newOrderDetail.quantity;
        console.log('old: ', product.quantity, ' new: ', newQuantity);
        const updateProduct = await Product.findByIdAndUpdate(product._id, {
            $set: {
                quantity: newQuantity
            }
        }, { new: true });
        orderDetailCreationStatus = 'success';
        res.status(201).redirect(`/admin/orderDetail/getAllOrderDetails?orderId=${req.query.orderId}`);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all order details
exports.getAllOrderDetails = async (req, res) => {
    try {
        const statusMessage = orderDetailCreationStatus === 'success'
            ? 'success'
            : 'fail';
        orderDetailCreationStatus = null;
        let add = false;
        let orderIdParams = null;
        let key_delete = null;
        let orderDetails = await OrderDetail.find().populate('orderId productId');
        let title = 'Order details';
        console.log(req.query);
        if (Object.keys(req.query).length > 0) {
            orderIdParams = req.query.orderId;
            orderDetails = orderDetails.filter(orderDetail => orderDetail.orderId._id == orderIdParams);
            add = true;
            key_delete = req.query.key_delete;
            title = 'All order details';
        }
        console.log(add, orderIdParams);
        res.status(200).render('admin/layoutAdmin', {
            title: title,
            body: 'orderDetails/listOrderDetails',
            statusMessage: statusMessage,
            orderDetails: orderDetails,
            add: add,
            orderIdParams: orderIdParams,
            key_delete: key_delete
        });
        
        // res.status(200).json(orderDetails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get order detail by ID
exports.getOrderDetailById = async (req, res) => {
    try {
        const orderDetail = await OrderDetail.findById(req.params.id).populate('orderId productId');
        if (!orderDetail) return res.status(404).json({ message: 'Order detail not found' });
        res.status(200).json(orderDetail);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update order detail
exports.updateOrderDetail = async (req, res) => {
    try {
        console.log(req.body.orderId, req.body.productName, req.body.quantity, req.body.odId);
        const product = await Product.findOne({ name: req.body.productName });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // cập nhập quantity trong product
        const crrOrderDetail = await OrderDetail.findById(req.body.odId).populate('orderId productId');

        if (crrOrderDetail.productId.name == req.body.productName) {
            const updateProduct = await Product.findByIdAndUpdate(product._id, {
                $set: {
                    quantity: crrOrderDetail.quantity + product.quantity - req.body.quantity
                }
            }, { new: true });
        } else {
            const ud_product_1 = await Product.findByIdAndUpdate(crrOrderDetail.productId._id, {
                $set: {
                    quantity: crrOrderDetail.productId.quantity + crrOrderDetail.quantity
                }
            }, { new: true });
            const ud_product_2 = await Product.findByIdAndUpdate(product._id, {
                $set: {
                    quantity: product.quantity - req.body.quantity
                }
            }, { new: true });
        }
        //
        const updatedOrderDetail = await OrderDetail.findByIdAndUpdate(req.params.id, {
            quantity: req.body.quantity,
            orderId: req.body.orderId,
            productId: product._id
        }, { new: true });
        res.status(200).redirect(`/admin/orderDetail/getAllOrderDetails?orderId=${req.body.orderId}`);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete order detail
exports.deleteOrderDetail = async (req, res) => {
    try {
        const od = await OrderDetail.findById(req.params.id).populate('orderId productId');
        if (!od) { 
            return res.status(404).json({ message: 'Order detail not found' });
        }
        const orderId = od.orderId._id;
        const ud_product = await Product.findByIdAndUpdate(od.productId._id, {
            $set: {
                quantity: od.productId.quantity + od.quantity
            }
        }, { new: true });
        await OrderDetail.findByIdAndDelete(req.params.id);
        res.status(200).redirect(`/admin/orderDetail/getAllOrderDetails?orderId=${orderId}`);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
