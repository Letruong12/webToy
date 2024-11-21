// Node v10.15.3
const axios = require('axios').default; // npm install axios
const CryptoJS = require('crypto-js'); // npm install crypto-js
const { v1: uuidv1 } = require('uuid'); // npm install uuid
const moment = require('moment'); // npm install moment
const qs = require('qs');
const Order = require('../models/orders.model');
const OrderDetail = require('../models/orderDetail.model');
const Product = require('../models/products.model');

// APP INFO
const config = {
    app_id: '2553',
    key1: 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL',
    key2: 'kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz',
    endpoint: 'https://sb-openapi.zalopay.vn/v2/create',
};
let globaluserId;

exports.payment = async (req, res) => {
    const { productIds, totals, userId, quantities } = req.body;
    console.log(productIds, totals, userId, quantities);
    globaluserId = userId;
    const embed_data = {
        //sau khi hoàn tất thanh toán sẽ đi vào link này (thường là link web thanh toán thành công của mình)
        redirecturl: 'https://e8cf-113-185-50-159.ngrok-free.app/cart?status=clear',
    };

    const items = [
        productIds,
        quantities
    ];
    const transID = Math.floor(Math.random() * 1000000);

    const order = {
        app_id: config.app_id,
        app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
        app_user: 'user123',
        app_time: Date.now(), // miliseconds
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        amount: totals * 1000,
        //khi thanh toán xong, zalopay server sẽ POST đến url này để thông báo cho server của mình
        //Chú ý: cần dùng ngrok để public url thì Zalopay Server mới call đến được
        callback_url: 'https://e8cf-113-185-50-159.ngrok-free.app/callback',
        description: `Lazada - Payment for the order #${transID}`,
        bank_code: '',
    };

    // appid|apptransid|appuser|amount|apptime|embeddata|item
    const data =
        config.app_id +
        '|' +
        order.app_trans_id +
        '|' +
        order.app_user +
        '|' +
        order.amount +
        '|' +
        order.app_time +
        '|' +
        order.embed_data +
        '|' +
        order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    try {
        const result = await axios.post(config.endpoint, null, { params: order });

        return res.redirect(result.data.order_url);
    } catch (error) {
        console.log(error);
    }
}

exports.callBack = async (req, res) => {
    let result = {};
    console.log(req.body);
    try {
        let dataStr = req.body.data;
        let reqMac = req.body.mac;

        let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
        console.log('mac =', mac);

        // kiểm tra callback hợp lệ (đến từ ZaloPay server)
        if (reqMac !== mac) {
            // callback không hợp lệ
            result.return_code = -1;
            result.return_message = 'mac not equal';
        } else {
            // thanh toán thành công
            // merchant cập nhật trạng thái cho đơn hàng ở đây
            let dataJson = JSON.parse(dataStr, config.key2);
            const amount = dataJson.amount;
            const items = JSON.parse(dataJson.item);
            updateOrder(globaluserId, amount, items);
            res.clearCookie('cart');
            //
            console.log(
                "update order's status = success where app_trans_id =",
                dataJson['app_trans_id'],
            );

            result.return_code = 1;
            result.return_message = 'success';
        }
    } catch (ex) {
        console.log('lỗi:::' + ex.message);
        result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
        result.return_message = ex.message;
    }

    // thông báo kết quả cho ZaloPay server
    res.json(result);
}

exports.cherckStatusOrder = async (req, res) => {
    const { app_trans_id } = req.params.id;

    let postData = {
        app_id: config.app_id,
        app_trans_id, // Input your app_trans_id
    };

    let data = postData.app_id + '|' + postData.app_trans_id + '|' + config.key1; // appid|app_trans_id|key1
    postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    let postConfig = {
        method: 'post',
        url: 'https://sb-openapi.zalopay.vn/v2/query',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify(postData),
    };

    try {
        const result = await axios(postConfig);
        console.log(result.data);
        return res.status(200).json(result.data);
    } catch (error) {
        console.log('lỗi');
        console.log(error);
    }
}

async function updateOrder(userId, amount, items) {
    try {
        console.log('updateOrder');
        console.log(userId, amount, items);
        const productIds = items[0];
        const quantities = items[1];
        console.log(productIds, quantities);

        // create order
        const newOrder = new Order({
            status: "Pending",
            isPaid: true,
            userId: userId
        });
        await newOrder.save();

        // create orderDetails
        const products = await Product.find({ _id: { $in: productIds } });
        for (let i = 0; i < products.length; i++){
            
            const newOrderDetail = new OrderDetail({
                quantity: quantities[i],
                orderId: newOrder._id,
                productId: products[i]._id
            });
            await newOrderDetail.save();
            const newQuantity = products[i].quantity - newOrderDetail.quantity;
            console.log('old: ', products[i].quantity, ' new: ', newQuantity);
            const updateProduct = await Product.findByIdAndUpdate(productIds[i]._id, {
                $set: {
                    quantity: newQuantity
                }
            }, { new: true });
        }
    } catch (error) {
        console.log(error);
    }
}

// 4111111111111111
// 	NGUYEN VAN A
// 01/25
// 	123