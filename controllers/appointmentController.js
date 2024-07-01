const Appointment = require('../models/appointmentModel');

module.exports.bookAppointment = async (req, res) => {
	try {
		const { patientID, doctorID, username, email } = req.params;
		const { clinic, timing, date } = req.body;
		if (
			!(patientID && doctorID && username && email && clinic && timing && date)
		)
			throw new Error('All required fields not found');
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
		res.status(200).json(appoint);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

module.exports.getAllAppointments = async (req, res) => {
	try {
		const { doctorID } = req.params;
		if (!doctorID) throw new Error('Doctor ID not found!');
		const appointments = await Appointment.find({ doctor: doctorID });
		res.status(200).json(appointments);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

module.exports.searchAppointment = async (req, res) => {
	try {
		const { doctorID, patientID } = req.params;
		const appointment = await Appointment.find({
			doctor: doctorID,
			patient: patientID,
		});
		res.status(200).json(appointment);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

module.exports.cancelAppointment = async (req, res) => {
	try {
		const { appointmentID } = req.params;
		if (!appointmentID) throw new Error('Appointment ID not found');
		const appointment = await Appointment.findByIdAndDelete(appointmentID);
		res.status(200).json(appointment);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};
