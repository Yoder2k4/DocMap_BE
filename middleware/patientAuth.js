const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        const {token} = req.cookies;
        if(!token) throw new Error('You are not authorized to access this route!');
        const verifiedToken = jwt.verify(token, process.env.tokenSecretKey);
        req.params.patientID = verifiedToken.userID;
        req.params.username = verifiedToken.username;
        req.params.email = verifiedToken.email;
        next();
    } catch (err) {
        res.status(400).json({"message": err.message});
    }
}