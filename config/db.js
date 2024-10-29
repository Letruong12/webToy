// test connect đến db local bằng mongodb compass
const mongoose = require('mongoose')

async function connectDB() {
    try {
        await mongoose.connect('mongodb://localhost:27017/myapp_db', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected');
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

module.exports = { connectDB };