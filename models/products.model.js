const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Product = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String },
    isActived: { type: Boolean, default: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true } // Tham chiếu đến Category
}, { timestamps: true });

module.exports = mongoose.model('Product', Product);
