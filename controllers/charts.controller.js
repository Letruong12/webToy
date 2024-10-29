const InventoryImport = require('../models/inventoryImport.model');
const Order = require('../models/orders.model');
const OrderDetail = require('../models/orderDetail.model');
const ImportDetail = require('../models/inventoryImportDetail.model');

exports.getChartImportData = async (req, res) => {
    try {
        // Tính tổng tiền nhập hàng
        const importsData = await InventoryImport.aggregate([
            {
                $lookup: {
                    from: 'inventoryimportdetails',
                    localField: '_id',
                    foreignField: 'importId',
                    as: 'importDetails'
                }
            }, {
                $unwind: "$importDetails"
            }, {
                $lookup: {
                    from: 'products',
                    localField: 'importDetails.productId',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            }, {
                $unwind: "$productDetails"
            }, {
                $group: {
                    _id: { month: { $month: "$createdAt" }, day: { $dayOfMonth: "$createdAt" } },
                    totalImportAmount: {
                        $sum: { $multiply: ["$importDetails.quantity", "$productDetails.price"] }
                    }
                }
            }, {
                $sort: { "_id.day": 1, "_id.month": 1 }
            }
        ]);

        // Tính tổng tiền đơn hàng
        const ordersData = await Order.aggregate([
            {
                $lookup: {
                    from: 'orderdetails',
                    localField: '_id',
                    foreignField: 'orderId',
                    as: 'orderDetails'
                }
            }, {
                $unwind: "$orderDetails"
            }, {
                $lookup: {
                    from: 'products',
                    localField: 'orderDetails.productId',
                    foreignField: '_id',
                    as: 'orderProductDetails'
                }
            }, {
                $unwind: "$orderProductDetails"
            }, {
                $group: {
                    _id: { month: { $month: "$createdAt" }, day: { $dayOfMonth: "$createdAt" } },
                    totalOrderAmount: {
                        $sum: { $multiply: ["$orderDetails.quantity", "$orderProductDetails.price"] }
                    }
                }
            }, {
                $sort: { "_id.day": 1, "_id.month": 1 }
            }
        ]);

        // Tạo labels và dữ liệu cho biểu đồ
        const labels = [...new Set([
            ...importsData.map(data => `${data._id.day}/${data._id.month}`),
            ...ordersData.map(data => `${data._id.day}/${data._id.month}`)
        ])];

        const totalImportData = labels.map(label => {
            const importData = importsData.find(data => `${data._id.day}/${data._id.month}` === label);
            return importData ? importData.totalImportAmount : 0;
        });

        const totalOrderData = labels.map(label => {
            const orderData = ordersData.find(data => `${data._id.day}/${data._id.month}` === label);
            return orderData ? orderData.totalOrderAmount : 0;
        });

        // Kết hợp labels và dữ liệu vào một mảng để sắp xếp
        const combinedData = labels.map((label, index) => ({
            label: label,
            totalImport: totalImportData[index],
            totalOrder: totalOrderData[index]
        }));

        // Sắp xếp theo ngày
        combinedData.sort((a, b) => {
            const [dayA, monthA] = a.label.split('/').map(Number);
            const [dayB, monthB] = b.label.split('/').map(Number);
            return new Date(2024, monthA - 1, dayA) - new Date(2024, monthB - 1, dayB); // Giả sử năm là 2024
        });

        // Tách lại thành các mảng riêng
        const sortedLabels = combinedData.map(data => data.label);
        const sortedTotalImportData = combinedData.map(data => data.totalImport);
        const sortedTotalOrderData = combinedData.map(data => data.totalOrder);

        console.log(sortedLabels, sortedTotalImportData, sortedTotalOrderData);

        return res.status(200).json({
            labels: sortedLabels,
            totalImportData: sortedTotalImportData,
            totalOrderData: sortedTotalOrderData
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getProductsSold = async (req, res) => {
    try {
        console.log(req.body.thang, req.body.nam);
        const year = req.body.nam, month = req.body.thang;
        const startDate = new Date(year, month - 1, 1); // Tháng bắt đầu (0 = tháng 1, 11 = tháng 12)
        const endDate = new Date(year, month, 1); // Ngày đầu tiên của tháng tiếp theo

        const productsSoldData = await OrderDetail.aggregate([
            {
                $lookup: {
                    from: 'orders',
                    localField: 'orderId',
                    foreignField: '_id',
                    as: 'orderInfo'
                }
            }, {
                $unwind: "$orderInfo"
            }, {
                $match: {
                    "orderInfo.createdAt": {
                        $gte: startDate,
                        $lt: endDate
                    }
                }
            }, {
                $lookup: {
                    from: 'products',
                    localField: 'productId',
                    foreignField: '_id',
                    as: 'productInfo'
                }
            }, {
                $unwind: "$productInfo"
            }, {
                $group: {
                    _id: { productId: "$productId", productName: "$productInfo.name" },
                    totalSoldQuantity: { $sum: "$quantity" }
                }
            }, {
                $sort: { totalSoldQuantity: -1 } // Sắp xếp theo số lượng bán ra giảm dần
            }
        ]);
        const productNames = productsSoldData.map(item => item._id.productName);
        const totalQuantities = productsSoldData.map(item => item.totalSoldQuantity);

        console.log("Product Names:", productNames);
        console.log("Total Sold Quantities:", totalQuantities);

        res.status(200).json({
            productNames: productNames,
            totalQuantities: totalQuantities,
            productsSoldData: productsSoldData // Nếu bạn cần trả về dữ liệu gốc
        });
    } catch (error) {
        console.error("Error calculating sold products:", error);
        return res.status(500).json({ message: error.message });
    }
};

exports.getProductsBought = async (req, res) => {
    try {
        const year = 2024, month = 10;
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 1);
        const getProductsBoughtData = await ImportDetail.aggregate([
            {
                $lookup: {
                    from: 'inventoryimports',
                    localField: 'importId',
                    foreignField: '_id',
                    as: 'importInfo'
                }
            }, {
                $unwind: "$importInfo"
            }, {
                $match: {
                    "importInfo.createdAt": {
                        $gte: startDate,
                        $lt: endDate
                    }
                }
            }, {
                $lookup: {
                    from: 'products',
                    localField: 'productId',
                    foreignField: '_id',
                    as: 'productInfo'
                }
            }, {
                $unwind: "$productInfo"
            }, {
                $group: {
                    _id: { productId: "$productId", productName: "$productInfo.name" },
                    totalSoldQuantity: { $sum: "$quantity" }
                }
            }, {
                $sort: { totalSoldQuantity: -1 } // Sắp xếp theo số lượng bán ra giảm dần
            }
        ]);
        const productNames = getProductsBoughtData.map(item => item._id.productName);
        const totalQuantities = getProductsBoughtData.map(item => item.totalSoldQuantity);
        res.status(200).json({
            productNames: productNames,
            totalQuantities: totalQuantities,
            productsBoughtData: getProductsBoughtData 
        });
    } catch (error) {
        console.log("Error: ", error.message);
        return res.status(500).json({ message: error.message });
    }
}