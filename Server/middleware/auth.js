const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if it's an admin token
        if (decoded.isAdmin) {
            const admin = await Admin.findById(decoded.id);
            if (!admin) {
                throw new Error();
            }
            req.admin = admin;
        }

        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = auth;