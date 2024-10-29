const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Order = new Schema({
    status: { type: String, required: true }, // Ví dụ: "Pending", "Completed"
    isPaid: { type: Boolean, default: false },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true } // Tham chiếu đến bảng User
}, { timestamps: true });

module.exports = mongoose.model('Order', Order);