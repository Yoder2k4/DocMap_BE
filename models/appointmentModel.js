const mongoose = require('mongoose');
const { Schema } = mongoose;

const appointmentSchema = new Schema({
	username: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	patient: {
		type: Schema.Types.ObjectId,
		required: true,
	},
	doctor: {
		type: Schema.Types.ObjectId,
		required: true,
	},
	clinic: {
		type: String,
		required: true,
	},
	timing: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		required: true,
	},
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

// delete all appointments that are in the past
const dateNow = new Date();
Appointment.find({ date: { $gt: dateNow } }).then((appointments) => {
	appointments.forEach((appointment) => {
		Appointment.findByIdAndDelete(appointment._id).then((res) =>
			console.log(res),
		);
	});
});

module.exports = Appointment;
