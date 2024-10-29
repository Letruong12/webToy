// const mongoose = require('mongoose');

// const uri = 'mongodb+srv://truong730525:lyDyFx5W7f1GF47l@projectnodejs1.hgijf.mongodb.net/myDBAlats?retryWrites=true&w=majority';

// const connectDB = async () => {
//     try {
//         await mongoose.connect(uri);
//         console.log('MongoDB Connected');
//     } catch (error) {
//         console.error('MongoDB connection error:', error);
//         process.exit(1);
//     }
// };

// module.exports = connectDB;

// connect mongodb alat
const mongoose = require('mongoose');
const uri = 'mongodb+srv://truong730525:lyDyFx5W7f1GF47l@projectnodejs1.hgijf.mongodb.net/myDBAlats';

async function connectDB() {
    try {
        console.log('loading connect ...')
        await mongoose.connect(uri);
        console.log("connect success!")
    }
    catch (error) {
        console.log("connect fail!")
        console.error('MongoDB connection error:', error);
    }
}

module.exports = { connectDB };
