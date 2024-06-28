const DoctorUser = require('../models/doctorUser');
const DoctorDetails = require('../models/doctorDetails');

module.exports.registerDoctor = async (req, res) => {
	const { email, password } = req.body;
	const user = new DoctorUser({ email });
	const registeredUser = await DoctorUser.register(user, password);
	req.login(registeredUser, (err) => {
		if (err) {
			return res.send(err);
		}
		res.json(registeredUser);
	});
};

module.exports.loginDoctor = async (req, res) => {
	const { email } = req.body;
	console.log(email);	
	const doctorAcc = await DoctorUser.findOne({ email });
	res.json(doctorAcc);
};

module.exports.loginFailRoute = (req, res) => {
	res.redirect('http://localhost:3000/doctor/login');
};

module.exports.registerDoctorInfo = async (req, res) => {
	const doctor = req.body;
	const { id } = req.params;
	doctor.doctorID = id;
	const newDoctor = new DoctorDetails(doctor);
	await newDoctor.save();
	const DoctorAcc = await DoctorUser.findById(id);
	DoctorAcc.accID = newDoctor._id;
	await DoctorAcc.save();
	res.json(newDoctor);
};

module.exports.getDoctorInfo = async (req, res) => {
	const { id } = req.params;
	const doctor = await DoctorDetails.findById(id);
	res.json(doctor);
};

module.exports.editDoctorProfile = async (req, res) => {
	const { id } = req.params;
	const doctor = req.body;
	const response = await DoctorDetails.findByIdAndUpdate(
		id,
		{ ...doctor },
		{ new: true },
	);
	res.json(response);
};

module.exports.deleteAcc = async (req, res) => {
	const { id } = req.params;
	const doctor = await DoctorUser.findById(id);
	const accID = doctor.accID;
	await DoctorUser.findByIdAndDelete(id);
	const response = await DoctorDetails.findByIdAndDelete(accID);
	res.json(response);
};
