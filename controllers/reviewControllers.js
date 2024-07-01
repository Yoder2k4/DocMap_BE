const Review = require('../models/reviews');

module.exports.addComment = async (req, res) => {
	try {
		console.log("hello");
		const { patientID, email, username, doctorID } = req.params;
		const { rating, subject, reviewBody } = req.body;
		if(!(patientID && rating && subject && reviewBody && email && username && doctorID)) throw new Error('Incomplete fields');
		const review = new Review({
			rating,
			subject,
			reviewBody,
			email,
			username,
			doctor: doctorID,
			author: patientID,
		});
		await review.save();
		res.status(200).json(review);
	} catch (err) {
		res.status(400).json({"message": err.message});
	}

};

module.exports.getAllComments = async (req, res) => {
	try {
		const { doctorID } = req.params;
		if(!doctorID) throw new Error('Doctor not found!!');
		const reviews = await Review.find({ doctor: doctorID });
		res.status(200).json(reviews);
	} catch (err) {
		res.status(400).json({"message": err.message});
	}
};

module.exports.deleteComment = async (req, res) => {
	try {
		const { reviewID } = req.params;
		if(!reviewID) throw new Error('Review Id not found!');
		await Review.findByIdAndDelete(reviewID);
		res.json({ message: 'Review deleted' });
	} catch (err) {
		res.status(400).json({"message": err.message});
	}
};
