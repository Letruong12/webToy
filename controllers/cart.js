const Product = require('../models/products.model');

exports.getCart = (req, res) => {
    const cart = JSON.parse(req.cookies.cart || '[]');
    console.log(cart);
    const totals = cart.reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);
    res.status(201).render('layout', {
        title: 'cart',
        body: 'cart',
        cart: cart,
        totals: totals
    });
}

exports.removeCart = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        let cart = JSON.parse(req.cookies.cart || '[]');

        cart = cart.filter(item => item._id.toString() !== product._id.toString());

        res.cookie('cart', JSON.stringify(cart), { maxAge: 24 * 60 * 60 * 1000 });
        res.redirect('/cart');
    } catch (error) {
        console.log(error.message);
    }
}

exports.addCart = async (req, res) => {
    try {
        console.log('add cart');
        const product = await Product.findById(req.params.id);

        let cart = JSON.parse(req.cookies.cart || '[]');

        const existingProductIndex = cart.findIndex(item => item._id.toString() === product._id.toString());
        if (existingProductIndex >= 0) {
            cart[existingProductIndex].quantity += 1;
        } else {
            const productCart = {
                _id: product._id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            }
            cart.push(productCart);
        }

        res.cookie('cart', JSON.stringify(cart), { maxAge: 24 * 60 * 60 * 1000 });
        res.redirect('/cart');
    } catch (error) {
        console.log(error.message);
    }
}

exports.checkCart = async (req, res) => {
    const cart = JSON.parse(req.cookies.cart || '[]');
    const selectedItemIds = req.body.selectedItems || [];
    const selectedItems = cart.filter(item => selectedItemIds.includes(item._id));

    if (selectedItems.length > 0) {
        const totals = selectedItems.reduce((total, item) => {
            return total + item.price * item.quantity;
        }, 0);
        res.status(201).render('layout', {
            body: 'checkCart',
            title: 'Checkout',
            cart: selectedItems,
            totals: totals
        });
    } else {
        res.send('No items selected.');
    }
}