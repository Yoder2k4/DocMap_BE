const express = require('express');
const router = express.Router();
const DoctorDetails = require('../models/doctorDetails');
const {
	registerDoctor,
	loginDoctor,
	registerDoctorInfo,
	getDoctorInfo,
	editDoctorProfile,
	deleteAcc,
} = require('../controllers/doctorControllers');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const doctorAuth = require('../middleware/doctorAuth');

router.route('/register').post(registerDoctor);
router.route('/login').post(loginDoctor);
router.route('/list').get(async (req, res) => {
	const DoctorList = await DoctorDetails.find({});
	res.json(DoctorList);
});
router
	.route('/uploadImg')
	.post(doctorAuth, upload.single('pfp'), (req, res) => {
		const imageInfo = req.file;
		res.json({ url: imageInfo.path, filename: imageInfo.filename });
	});
router
	.route('/doctorData')
	.post(doctorAuth, registerDoctorInfo)
	.get(doctorAuth, getDoctorInfo)
	.put(doctorAuth, editDoctorProfile)
	.delete(doctorAuth, deleteAcc);

module.exports = router;
