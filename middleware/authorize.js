exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
}

exports.authorizeModels = (...model) => {
    return (req, res, next) => { 

        return res.status(403).json({ message: 'Access denied' });
    }
}