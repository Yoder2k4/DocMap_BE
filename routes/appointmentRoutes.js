const express = require('express');
const router = express.Router();
const {
	bookAppointment,
	searchAppointment,
	cancelAppointment,
	getAllAppointments,
} = require('../controllers/appointmentController');
const patientAuth = require('../middleware/patientAuth');
const doctorAuth = require('../middleware/doctorAuth');

router.route('/cancel/:appointmentID').delete(patientAuth, cancelAppointment);
router.route('/book/:doctorID').post(patientAuth, bookAppointment);
router.route('/search/:doctorID').get(patientAuth, searchAppointment);
router.route('/allAppointments').get(doctorAuth, getAllAppointments);

module.exports = router;
