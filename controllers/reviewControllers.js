const Review = require('../models/reviews');

module.exports.addComment = async (req, res) => {
	const { userId, doctorId } = req.params;
	const { rating, subject, reviewBody, email, username } = req.body;
	const review = new Review({
		rating,
		subject,
		reviewBody,
		email,
		username,
		doctor: doctorId,
		author: userId,
	});
	await review.save();
	res.json(review);
};

module.exports.getAllComments = async (req, res) => {
	const { doctorId } = req.params;
	const reviews = await Review.find({ doctor: doctorId });
	res.json(reviews);
};

module.exports.deleteComment = async (req, res) => {
	const { reviewId } = req.params;
	await Review.findByIdAndDelete(reviewId);
	res.json({ message: 'Review deleted' });
};
