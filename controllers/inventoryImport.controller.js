const InventoryImport = require('../models/inventoryImport.model');
const Provider = require('../models/providers.model');
const ImportDetail = require('../models/inventoryImportDetail.model');

let importCreationStatus = null;

// Create a new import
exports.createImport = async (req, res) => {
    try {
        const provider = await Provider.findOne({ name: req.body.providerName });
        if (!provider) {
            return res.status(404).json({ message: 'provider not found' });
        }
        const newImport = new InventoryImport({
            status: req.body.status,
            isPaid: (req.body.isPaid == "True"),
            providerId: provider._id
        });
        await newImport.save();
        importCreationStatus = true;
        res.status(201).redirect('/admin/import/getAllImports');
    } catch (error) {
        importCreationStatus = false;
        res.status(500).json({ message: error.message });
    }
};

// Get all imports
exports.getAllImports = async (req, res) => {
    try {
        const statusMessage = importCreationStatus ? 'success' : 'fail';
        importCreationStatus = null;
        const imports = await InventoryImport.find().populate('providerId');

        const importsWithTotal = await Promise.all(
            imports.map(async (importData) => {
                try {
                    const importDetails = await ImportDetail.find({ importId: importData._id })
                        .populate('productId');
                    const totalAmount = importDetails.reduce((total, detail) => {
                        console.log(detail.productId.name ,total, detail.quantity, detail.productId.price);
                        return total + (detail.quantity * detail.productId.price);
                    }, 0);
                    return {
                        ...importData._doc,
                        totalAmount: totalAmount
                    };
                } catch (error) {
                    console.log(`Error calculating total for import ID ${importData._id}: `, error.message);
                    return {
                        ...importData._doc,
                        totalAmount: 0,
                        errorMessage: 'Error calculating total'
                    };
                }
            })
        );
        console.log(importsWithTotal);

        res.status(200).render('admin/layoutAdmin', {
            title: 'All imports',
            body: 'inventoryImports/listImports',
            imports: importsWithTotal,
            statusMessage: statusMessage
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get import by ID
exports.getImportById = async (req, res) => {
    try {
        const importData = await InventoryImport.findById(req.params.id).populate('userId');
        if (!importData) return res.status(404).json({ message: 'Import not found' });
        res.status(200).json(importData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update import
exports.updateImport = async (req, res) => {
    try {
        const provider = await Provider.findOne({ name: req.body.providerName });
        if (!provider) {
            return res.status(404).json({ message: 'provider not found' });
        }
        const updatedImport = await InventoryImport.findByIdAndUpdate(req.params.id, {
            status: req.body.status,
            isPaid: (req.body.isPaid == "True"),
            providerId: provider._id
        }, { new: true });
        res.status(200).redirect('/admin/import/getAllImports');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete import
exports.deleteImport = async (req, res) => {
    try {
        console.log(req.params.id);
        const importDetail = await ImportDetail.find({ importId: req.params.id });
        if (importDetail.length > 0) { 
            res.status(200).redirect(`/admin/importDetail/getAllImportDetails?importId=${req.params.id}&key_delete=true`);
        }
        else {
            await InventoryImport.findByIdAndDelete(req.params.id);
            res.status(200).redirect('/admin/import/getAllImports');
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const updateStatus = await InventoryImport.findByIdAndUpdate(req.params.id, {
            status: "Completed"
        }, { new: true });
        if (!updateStatus)
            res.status(404).json({ status: 404, message: "not found" });
        res.redirect('/admin/import/getAllImports');
    } catch (error) {
        console.log(error);
    }
}
