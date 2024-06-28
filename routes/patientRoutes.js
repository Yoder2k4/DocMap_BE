const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
	registerPatient,
	loginPatient,
	loginFailRoute,
	getAllDoctors,
} = require('../controllers/patientControllers');

router.route('/register').post(registerPatient);

router
	.route('/login')
	.post(
		passport.authenticate('local-patient', {
			failureRedirect: '/patient/login',
			keepSessionInfo: true,
		}),
		loginPatient,
	)
	.get(loginFailRoute);

router.route('/user').get(getAllDoctors);

module.exports = router;
