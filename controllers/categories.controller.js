const Category = require('../models/categories.model');

let userCreationStatus = null;
// Create a new category
exports.createCategory = async (req, res) => {
    try {
        const newCategory = new Category(req.body);
        await newCategory.save();
        userCreationStatus = 'success';
        console.log(newCategory);
        res.status(201).redirect('/admin/category/getAllCategories');
    } catch (error) {
        userCreationStatus = 'failure';
        res.status(500).json({ error: error.message });
    }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const statusMessage = userCreationStatus === 'success'
            ? 'success'
            : 'fail';
        userCreationStatus = null;
        const categories = await Category.find();
        console.log(categories);
        res.status(200).render('admin/layoutAdmin', {
            title: 'all Categories',
            body: 'categories/listCategories',
            categories: categories,
            statusMessage: statusMessage
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update category
exports.updateCategory = async (req, res) => {
    try {
        const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete category
exports.deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
