const express = require('express');
const router = express.Router();
const {
	registerPatient,
	loginPatient,
	getAllDoctors,
	getDoctor
} = require('../controllers/patientControllers');
const patientAuth = require('../middleware/patientAuth');

router.route('/register').post(registerPatient);
router.route('/login').post(loginPatient);
router.route('/user').get(patientAuth, getAllDoctors);
router.route('/doctor/:doctorID').get(patientAuth, getDoctor);

module.exports = router;
