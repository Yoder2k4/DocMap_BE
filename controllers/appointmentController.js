const Appointment = require('../models/appointmentModel');

module.exports.bookAppointment = async (req, res) => {
	const { patientID, doctorID } = req.params;
	const { username, email, clinic, timing, date } = req.body;
	const appoint = new Appointment({
		username,
		email,
		clinic,
		timing,
		date,
		patient: patientID,
		doctor: doctorID,
	});
	await appoint.save();
	res.json(appoint);
};

module.exports.getAllAppointments = async (req, res) => {
	const { doctorID } = req.params;
	const appointments = await Appointment.find({ doctor: doctorID });
	res.json(appointments);
};

module.exports.searchAppointment = async (req, res) => {
	const { doctorID, patientID } = req.params;
	const appointment = await Appointment.find({
		doctor: doctorID,
		patient: patientID,
	});
	res.json(appointment);
};

module.exports.cancelAppointment = async (req, res) => {
    const { appointmentID } = req.params;
    const appointment = await Appointment.findByIdAndDelete(appointmentID);
    res.json(appointment);
}