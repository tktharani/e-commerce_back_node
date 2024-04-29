const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    // Check if the token starts with "Bearer " and extract the token
    let token = authHeader;
    if (token.startsWith('Bearer ')) {
        token = token.substring(7); // Remove "Bearer " prefix
    }

    try {
        const decoded = jwt.verify(token, 'my-secret-key');
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
}

module.exports = verifyToken;
