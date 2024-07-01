const PatientUser = require('../models/patientUser');
const DoctorDetails = require('../models/doctorDetails');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports.registerPatient = async (req, res) => {
	try {
		const { email, username, password } = req.body;
		console.log(req.body);
		if (!(email && username && password)) {
			throw new Error('All fields are not filled!');
		}
		const searchUser = await PatientUser.findOne({ email });
		if (searchUser) {
			throw new Error('User with the same email already exists');
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = await PatientUser.create({
			email,
			username,
			password: hashedPassword,
		});
		if (!newUser) throw new Error('User cannot be registered');
		const token = jwt.sign(
			{ userID: newUser._id, email, username },
			process.env.tokenSecretKey,
			{ expiresIn: 24 * 60 * 60 },
		);
		const options = {
			expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
			httpOnly: true,
			secure: (process.env.NODE_ENV==="production"),
			sameSite: 'none'
		};
		res.cookie('token', token, options).json({ success: true, userID: newUser._id });
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

module.exports.loginPatient = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!(email && password))
			throw new Error('Email or password not provided!');
		const patientAcc = await PatientUser.findOne({ email });
		console.log(patientAcc);
		if (!patientAcc) throw new Error('Invalid credentials');
		if (!(await bcrypt.compare(password, patientAcc.password)))
			throw new Error('Invalid credentials');
		const token = jwt.sign(
			{ userID: patientAcc._id, email, username: patientAcc.username },
			process.env.tokenSecretKey,
			{ expiresIn: 24 * 60 * 60 },
		);
		const options = {
			expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
			httpOnly: true,
			secure: (process.env.NODE_ENV==="production"),
			sameSite: 'none'
		};
		res.status(200).cookie('token', token, options).json({ success: true, userID: patientAcc._id });
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

module.exports.getAllDoctors = async (req, res) => {
	const doctorDetails = await DoctorDetails.find();
	res.status(200).json(doctorDetails);
};

module.exports.getDoctor = async (req, res) => {
	try {
		const { doctorID } = req.params;
		const doctor = await DoctorDetails.findOne({doctorID});
		res.status(200).json(doctor);
	} catch (err) {
		res.status(400).json({"message": err.message});
	}

};
