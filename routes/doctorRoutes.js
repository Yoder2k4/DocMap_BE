if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const express = require('express');
const router = express.Router();
const DoctorDetails = require('../models/doctorDetails');
const passport = require('passport');
const {
	registerDoctor,
	loginDoctor,
	loginFailRoute,
	registerDoctorInfo,
	getDoctorInfo,
	editDoctorProfile,
	deleteAcc,
} = require('../controllers/doctorControllers');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/register').post(registerDoctor);

router
	.route('/login')
	.post(
		passport.authenticate('local-doctor', {
			failureRedirect: '/doctor/login',
			keepSessionInfo: true,
		}),
		loginDoctor,
	)
	.get(loginFailRoute);

router.route('/list').get(async (req, res) => {
	const DoctorList = await DoctorDetails.find({});
	res.json(DoctorList);
});

router.route('/uploadImg').post(upload.single('pfp'), (req, res) => {
	const imageInfo = req.file;
	res.json({ url: imageInfo.path, filename: imageInfo.filename });
});

router
	.route('/:id')
	.post(registerDoctorInfo)
	.get(getDoctorInfo)
	.put(editDoctorProfile)
	.delete(deleteAcc);

module.exports = router;
