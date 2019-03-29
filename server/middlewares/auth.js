
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

module.exports = {
    verifyToken
};