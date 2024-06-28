const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
	rating: {
		type: Number,
		required: true,
	},
	subject: {
		type: String,
		required: true,
	},
	reviewBody: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
	},
	time: {
		type: Date,
		default: Date.now,
	},
	doctor: {
		type: Schema.Types.ObjectId,
		ref: 'DoctorDetail',
		required: true,
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: 'Patient',
		required: true,
	},
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
