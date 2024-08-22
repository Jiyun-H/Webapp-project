const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        console.error('No token, authorization denied');
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    try {
        const decoded = jwt.verify(token, 'token');
        req.user = decoded;
        console.log('Token validated successfully:', decoded);
        next();
    } catch (err) {
        console.error('Token validation error:', err);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = auth;
