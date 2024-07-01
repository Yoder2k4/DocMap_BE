const jwt = require('jsonwebtoken');
const doctorUser = require('../models/doctorUser');

module.exports = async (req, res, next) => {
    try {
        console.log(req.route.path);
        const {doctorToken} = req.cookies;
        console.log("doctorToken: ", doctorToken);
        if(!doctorToken) throw new Error('You are not authorized to access this route!');
        const verifiedToken = jwt.verify(doctorToken, process.env.tokenSecretKey);
        req.params.doctorID = verifiedToken.userID;
        const doctorAcc = await doctorUser.findById(req.params.doctorID);
        if(req.route.path!=='/doctorData' && req.route.path!=='uploadImg' && !doctorAcc.accID) return res.status(304).json({redirect: true});
        next();
    } catch (err) {
        res.status(400).json({"message": err.message});
    }
}