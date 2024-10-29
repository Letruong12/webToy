const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderDetail = new Schema({
    quantity: { type: Number, required: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true }
}, { timestamps: true });

module.exports = mongoose.model('OrderDetail', OrderDetail);
