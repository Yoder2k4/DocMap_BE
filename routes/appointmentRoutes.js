const express = require('express');
const router = express.Router();
const {
	bookAppointment,
	searchAppointment,
    cancelAppointment,
    getAllAppointments,
} = require('../controllers/appointmentController');

router.route('/cancel/:appointmentID').delete(cancelAppointment);
router
	.route('/:patientID/:doctorID')
	.post(bookAppointment)
	.get(searchAppointment);
router.route('/:doctorID').get(getAllAppointments);

module.exports = router;
