const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const doctorUserSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	accID: {
		type: String,
	},
});

doctorUserSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model('DoctorAccount', doctorUserSchema);
