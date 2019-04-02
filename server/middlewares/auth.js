
const jwt = require('jsonwebtoken');

// Verify token
let verifyToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                response: [],
                error: err
            });
        }

        req.user = decoded.user;

        next();
    });
    // console.log(token);
}

// Verify Admin Role
const verifyRole = (req, res, next) => {
    const role = req.user.role;
    
    if (role != 'ADMIN_ROLE') {
        return res.status(401).json({
            response: [],
            error: 'Admin permissions are neccesary.'
        });
    }

    next();
}

module.exports = {
    verifyToken,
    verifyRole
};