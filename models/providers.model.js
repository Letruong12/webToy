const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const provider = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Provider', provider);
