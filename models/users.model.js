const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    idRole: { type: Schema.Types.ObjectId, ref: 'Role', required: true }
}, { timestamps: true });

module.exports = mongoose.model('User', User);