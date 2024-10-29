const ImportDetail = require('../models/inventoryImportDetail.model');
const Product = require('../models/products.model');

let importDetailCreationStatus = null;

// Create a new import detail
exports.createImportDetail = async (req, res) => {
    try {
        const product = await Product.findOne({ name: req.body.productName });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const newImportDetail = new ImportDetail({
            quantity: req.body.quantity,
            importId: req.query.importId,
            productId: product._id
        });
        await newImportDetail.save();
        const updateProduct = await Product.findByIdAndUpdate(product._id, {
            $set: {
                quantity: Number(product.quantity) + Number(req.body.quantity)
            }
        }, { new: true });
        importDetailCreationStatus = true;
        res.status(201).redirect(`/admin/importDetail/getAllImportDetails?importId=${req.query.importId}`);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all import details
exports.getAllImportDetails = async (req, res) => {
    try {
        const statusMessage = importDetailCreationStatus ? 'success' : 'fail';
        importDetailCreationStatus = null;
        let add = false;
        let importIdQuery = null;
        let key_delete = null;
        let importDetails = await ImportDetail.find().populate('importId productId');
        let title = 'Import details';
        if (Object.keys(req.query).length > 0) {
            importIdQuery = req.query.importId;
            importDetails = importDetails.filter(importDetail => importDetail.importId._id == importIdQuery);
            add = true;
            key_delete = req.query.key_delete;
            title = 'All import details';
        }
        res.status(200).render('admin/layoutAdmin', {
            title: title,
            body: 'inventoryImportDetails/listImportDetails',
            statusMessage: statusMessage,
            importDetails: importDetails,
            add: add,
            importIdQuery: importIdQuery,
            key_delete: key_delete
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get import detail by ID
exports.getImportDetailById = async (req, res) => {
    try {
        const importDetail = await ImportDetail.findById(req.params.id).populate('importId productId');
        if (!importDetail) return res.status(404).json({ message: 'Import detail not found' });
        res.status(200).json(importDetail);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update import detail
exports.updateImportDetail = async (req, res) => {
    try {
        const product = await Product.findOne({ name: req.body.productName });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // cap nhap product
        const crrImportDetail = await ImportDetail.findById(req.body.idId).populate('importId productId');
        if (crrImportDetail.productId.name == req.body.productName) {
            const updateProduct = await Product.findByIdAndUpdate(product._id, {
                $set: {
                    quantity: Number(product.quantity) - Number(crrImportDetail.quantity) + Number(req.body.quantity) 
                }
            }, { new: true });
        }
        else {
            const ud_1 = await Product.findByIdAndUpdate(crrImportDetail.productId._id, {
                $set: {
                    quantity: Number(crrImportDetail.productId.quantity) - Number(crrImportDetail.quantity)
                }
            }, { new: true });
            const ud_2 = await Product.findByIdAndUpdate(product._id, {
                $set: {
                    quantity: Number(product.quantity) + Number(req.body.quantity)
                }
            }, { new: true });
        }
        //
        const updatedImportDetail = await ImportDetail.findByIdAndUpdate(req.params.id, {
            quantity: req.body.quantity,
            importId: req.body.importId,
            productId: product._id
        }, { new: true });
        res.status(200).redirect(`/admin/importDetail/getAllImportDetails?importId=${req.body.importId}`);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete import detail
exports.deleteImportDetail = async (req, res) => {
    try {
        const od = await ImportDetail.findById(req.params.id).populate('importId productId');
        if (!od)
            return res.status(404).json({ message: 'Import detail not found' });
        const importId = od.importId._id;
        const ud_product = await Product.findByIdAndUpdate(od.productId._id, {
            $set: {
                quantity: Number(od.productId.quantity) - Number(od.quantity)
            }
        }, { new: true });
        await ImportDetail.findByIdAndDelete(req.params.id);
        res.status(200).redirect(`/admin/importDetail/getAllImportDetails?importId=${importId}`);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
