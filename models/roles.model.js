const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Role = new Schema({
    name: { type: String, required: true, default: 'normal' },
    description: { type: String, require: true }
}, { timestamps: true });

module.exports = mongoose.model('Role', Role);