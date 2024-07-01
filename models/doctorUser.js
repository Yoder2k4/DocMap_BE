const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const doctorUserSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	accID: {
		type: String,
	},
});

module.exports = mongoose.model('DoctorAccount', doctorUserSchema);
