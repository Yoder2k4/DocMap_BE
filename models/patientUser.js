const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const patientUserSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	username: {
		type: String,
		required: true,
	},
});

patientUserSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model('Patient', patientUserSchema);
