const DoctorUser = require('../models/doctorUser');
const DoctorDetails = require('../models/doctorDetails');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports.registerDoctor = async (req, res) => {
	try {
		const { email, password } = req.body;
		if(!(email && password)) throw new Error('All credentials required');
		const searchUser = await DoctorUser.findOne({ email });
		if (searchUser) throw new Error('User already exists');
		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = await DoctorUser.create({
			email,
			password: hashedPassword,
		});
		const token = jwt.sign(
			{ email, userID: newUser._id },
			process.env.tokenSecretKey,
			{ expiresIn: 24 * 60 * 60 },
		);
		const options = {
			expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
			httpOnly: true,
		};
		res.status(200).cookie('doctorToken', token, options).json({success: true});
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

module.exports.loginDoctor = async (req, res) => {
	try {
		const { email, password } = req.body;
		if(!(email && password)) throw new Error('All credentials required');
		const doctorAcc = await DoctorUser.findOne({ email });
		if(!doctorAcc || !(await bcrypt.compare(password, doctorAcc.password))) throw new Error('Invalid credentials');
		const token = jwt.sign(
			{ email, userID: doctorAcc._id },
			process.env.tokenSecretKey,
			{ expiresIn: 24 * 60 * 60 },
		);
		const options = {
			expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
			httpOnly: true,
		};
		if(!doctorAcc.accID) return res.status(304).cookie('doctorToken', token, options).json({redirect : true});
		res.status(200).cookie('doctorToken', token, options).json({success: true});
	} catch (err) {
		res.status(400).json({"message": err.message});
	}
};

module.exports.registerDoctorInfo = async (req, res) => {
	try {
		const doctor = req.body;
		const { doctorID } = req.params;
		doctor.doctorID = doctorID;
		const newDoctor = new DoctorDetails(doctor);
		await newDoctor.save();
		const DoctorAcc = await DoctorUser.findById(doctorID);
		DoctorAcc.accID = newDoctor._id;
		await DoctorAcc.save();
		res.status(200).json(newDoctor);
	} catch (err) {
		res.status(400).json({"message": err.message});
	}
	
};

module.exports.getDoctorInfo = async (req, res) => {
	try {
		const { doctorID } = req.params;
		const doctor = await DoctorDetails.findOne({doctorID});
		res.status(200).json(doctor);
	} catch (err) {
		res.status(400).json({"message": err.message});
	}

};

module.exports.editDoctorProfile = async (req, res) => {
	try {
		const { doctorID } = req.params;
		const doctor = req.body;
		const response = await DoctorDetails.findOneAndUpdate({doctorID}, {...doctor}, {new: true});
		res.status(200).json(response);
	} catch (err) {
		res.status(400).json({"message": err.message});
	}
};

module.exports.deleteAcc = async (req, res) => {
	try {
		const { doctorID } = req.params;
		const doctor = await DoctorUser.findById(doctorID);
		const accID = doctor.accID;
		await DoctorUser.findByIdAndDelete(doctorID);
		const response = await DoctorDetails.findByIdAndDelete(accID);
		res.status(200).json(response);
	} catch (err) {
		res.status(400).json({"message": err.message});
	}
};
