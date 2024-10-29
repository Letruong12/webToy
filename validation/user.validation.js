const Joi = require('joi');

exports.userValidator = Joi.object({
    name: Joi.string().required().min(6).max(255).messages({
        "string.empty": "Tên không được bỏ trống",
        "any.required": "Tên là bắt buộc",
        "string.min": "Tên phải có ít nhất {#limit} ký tự",
        "string.max": "Tên phải có ít hơn {#limit + 1} ký tự"
    }),
    email: Joi.string().required().email().messages({
        "string.empty": "Email không được bỏ trống",
        "any.required": "Email là bắt buộc",
        "string.email": "Email không đúng định dạng"
    }),
    age: Joi.number().integer().min(18).max(100).required().messages({
        "number.base": "Tuổi phải là một số nguyên",
        "number.min": "Tuổi phải lớn hơn hoặc bằng {#limit}",
        "number.max": "Tuổi phải nhỏ hơn hoặc bằng {#limit}",
        "any.required": "Tuổi là bắt buộc"
    }),
    password: Joi.string().required().min(8).max(128).messages({
        "string.empty": "Mật khẩu không được bỏ trống",
        "any.required": "Mật khẩu là bắt buộc",
        "string.min": "Mật khẩu phải có ít nhất {#limit} ký tự",
        "string.max": "Mật khẩu phải có ít hơn {#limit + 1} ký tự"
    }),
    confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({
        "any.only": "Xác nhận mật khẩu phải trùng khớp với mật khẩu",
        "any.required": "Xác nhận mật khẩu là bắt buộc"
    })
});
