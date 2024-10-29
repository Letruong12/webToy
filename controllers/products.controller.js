const Product = require('../models/products.model');
const Category = require('../models/categories.model');

let productCreationStatus = null;

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        console.log(req.body.name, req.body.description, req.body.price, req.body.quantity, req.body.image, req.body.isActived, req.body.categoryName);
        const category = await Category.findOne({ name: req.body.categoryName });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        const newProduct = new Product({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            quantity: req.body.quantity,
            image: req.body.image,
            isActived: (req.body.isActived === "True"), 
            categoryId: category._id 
        });
        await newProduct.save();
        productCreationStatus = 'success';
        res.status(201).redirect('/admin/product/getAllProducts');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const statusMessage = productCreationStatus === 'success'
            ? 'success'
            : 'fail';
        productCreationStatus = null;
        let products = await Product.find().populate('categoryId');
        if (Object.keys(req.query).length > 0) {
            console.log(req.query);
            products = products.filter(product => product.categoryId._id == req.query.categoryId);
        }
        res.status(200).render('admin/layoutAdmin', {
            title: 'All products',
            body: 'products/listProducts',
            products: products,
            statusMessage: statusMessage
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('categoryId');
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update product
exports.updateProduct = async (req, res) => {
    try {
        console.log(req.body.name, req.body.description, req.body.price, req.body.quantity, req.body.image, req.body.isActived, req.body.categoryName);
        const category = await Category.findOne({ name: req.body.categoryName });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, 
            {
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                quantity: req.body.quantity,
                image: req.body.image,
                isActived: (req.body.isActived == "True"),
                categoryId: category._id
            }, { new: true });
        res.status(201).redirect('/admin/product/getAllProducts');
        // res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete product
exports.deleteProduct = async (req, res) => {
    try {
        console.log(req.params.id)
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).redirect('/admin/product/getAllProducts');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
