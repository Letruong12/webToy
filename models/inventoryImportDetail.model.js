    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;

    const inventoryImportDetail = new Schema({
        quantity: { type: Number, required: true },
        importId: { type: Schema.Types.ObjectId, ref: 'InventoryImport', required: true }, // Tham chiếu đến Import
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true } // Tham chiếu đến Product
    }, { timestamps: true });

    module.exports = mongoose.model('InventoryImportDetail', inventoryImportDetail);