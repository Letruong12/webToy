const { userValidator } = require('../validation/user.validation');
const User = require('../models/users.model');
const Role = require('../models/roles.model');
const bcryptjs = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
require('dotenv').config();
const { SECRET_CODE } = process.env;

exports.signUp = async (req, res) => {
    try {
        console.log('vaof sign up');
        console.log(req.body);
        // 1: validate du lieu nguoi dung
        const { error } = userValidator.validate(req.body, { abortEarly: false });
        if (error) { 
            const errors = error.details.map(err => err.message);
            return res.status(400).json({ success:false, message: errors });
        }
        console.log('validation - pass!');
        // 2: kiem tra xem email da ton tai trong he thong hay chua
        const userExits = await User.findOne({ email: req.body.email });
        if (userExits) {
            return res.status(400).json({ success:false, message: "Email da ton tai" });
        }
        console.log('user exit - pass!');

        // 3: Ma hoa password
        const hashedPassword = await bcryptjs.hash(req.body.password, 10);

        // bonus: thêm role
        const role = await Role.findOne({ name: "normal" });

        // 4: khoi tao user trong db
        const user = await User.create({
            ...req.body,
            password: hashedPassword,
            idRole: role.id
        })
        // 5: thong bao cho nguoi dung dang ky thanh cong
        user.password = undefined;
        console.log('sgin up - pass!');
        return res.status(201).json({ success: true, message: "Đăng ký thành công! Bạn có thể đăng nhập ngay.", user });
        
        // return res.status(201).json({
        //     success: true,
        //     message: "Dang ky thanh cong! Bạn có thể đăng nhập ngay."
        // })

    } catch (error) {
        return res.status(500).json({
            name: error.name,
            message: error.message
        })
    }
}

exports.login = async (req, res) => {
    console.log('vao login -  pass!');
    console.log(SECRET_CODE);
    const { email, password, key_role } = req.body;
    console.log(email, password, key_role, ' - pass!');
    const user = await User.findOne({ email });
    const role = await Role.findOne({ _id: user.idRole });
    console.log(user, role);
    
    // if (!user || user.password != password || role.name != key_role) {
    //     return res.status(401).json({ message: "Thông tin xác thực không hợp lê!" });
    // }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!user || !isPasswordValid || role.name != key_role) {
        return res.status(401).json({ message: "Thông tin xác thực không hợp lệ!" });
    }
    const token = jsonwebtoken.sign({ userId: user._id, role: role.name }, SECRET_CODE, { expiresIn: '2h' });
    res.cookie('authToken', token, {
        httpOnly: true, 
        secure: true,  
        maxAge: 2 * 60 * 60 * 1000 
    });
    if (key_role == "normal")
        return res.status(201).redirect('/dashboard');
    else
        return res.status(201).redirect('/admin/dashboard');
}

// chua dung den
exports.loginAdmin = async (req, res, next) => {
    console.log('vao login -  pass!');
    const { email, password, key_role } = req.body;
    console.log(email, password, key_role, ' - pass!');
    return res.status(201).json({ message: "admin dang nhap thanh cong!" });
}

exports.authenticateToken = (req, res, next) => {
    console.log('vao authen');
    const token = req.cookies.authToken
    if (!token) return res.status(403).render('pageError', {
        message: "Bạn chưa đăng nhập hệ thống",
        link: '/adminLogin',
        content: 'back to login'
    });

    jsonwebtoken.verify(token, SECRET_CODE, (err, user) => {
        if (err)
            return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn!' });

        req.user = user; // Lưu thông tin user vào req để sử dụng trong các middleware khác
        console.log(user, ' - pass!');
        next();
    });
}