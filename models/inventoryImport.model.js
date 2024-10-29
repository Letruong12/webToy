const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const inventoryImport = new Schema({
    status: { type: String, required: true }, // Ví dụ: "Pending", "Completed"
    isPaid: { type: Boolean, default: false }, 
    providerId: { type: Schema.Types.ObjectId, ref: 'Provider', required: true } // Tham chiếu đến Provider
}, { timestamps: true });

module.exports = mongoose.model('InventoryImport', inventoryImport);
