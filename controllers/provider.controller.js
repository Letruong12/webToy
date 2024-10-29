const Provider = require('../models/providers.model');

let providerCreationStatus = null;

// Tạo mới một provider
exports.createProvider = async (req, res) => {
    try {
        const { name, email, phoneNumber, address } = req.body;
        const newProvider = new Provider({ name, email, phoneNumber, address });

        await newProvider.save();
        providerCreationStatus = 'success';
        res.status(201).redirect('/admin/provider/getAllProviders');
    } catch (error) {
        res.status(500).json({ message: 'Error creating provider', error });
    }
};

// Lấy danh sách tất cả provider
exports.getAllProviders = async (req, res) => {
    try {
        const statusMessage = providerCreationStatus == 'success' ? 'success' : 'fail';
        const providers = await Provider.find();
        res.status(200).render('admin/layoutAdmin', {
            title: 'All provider',
            body: 'providers/listProviders',
            providers: providers,
            statusMessage: statusMessage
        })
    } catch (error) {
        res.status(500).json({ message: 'Error fetching providers', error });
    }
};

// Lấy một provider theo id
exports.getProviderById = async (req, res) => {
    try {
        const provider = await Provider.findById(req.params.id);
        if (!provider) {
            return res.status(404).json({ message: 'Provider not found' });
        }
        res.status(200).json(provider);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching provider', error });
    }
};

// Cập nhật một provider theo id
exports.updateProvider = async (req, res) => {
    try {
        const { name, email, phoneNumber, address } = req.body;
        const updatedProvider = await Provider.findByIdAndUpdate(
            req.params.id,
            { name, email, phoneNumber, address },
            { new: true }
        );

        if (!updatedProvider) {
            return res.status(404).json({ message: 'Provider not found' });
        }

        res.status(200).redirect('/admin/provider/getAllProviders');
    } catch (error) {
        res.status(500).json({ message: 'Error updating provider', error });
    }
};

// Xóa một provider theo id
exports.deleteProvider = async (req, res) => {
    try {
        const deletedProvider = await Provider.findByIdAndDelete(req.params.id);
        if (!deletedProvider) {
            return res.status(404).json({ message: 'Provider not found' });
        }

        res.status(200).redirect('/admin/provider/getAllProviders');
    } catch (error) {
        res.status(500).json({ message: 'Error deleting provider', error });
    }
};
