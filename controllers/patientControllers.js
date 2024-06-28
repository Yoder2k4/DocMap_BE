const PatientUser = require('../models/patientUser');
const DoctorDetails = require('../models/doctorDetails');

module.exports.registerPatient = async (req, res) => {
	const { email, username, password } = req.body;
	const user = new PatientUser({ email, username });
	const registeredUser = await PatientUser.register(user, password);
	req.login(registeredUser, (err) => {
		if (err) {
			return res.send(err);
		}
		res.json(registeredUser);
	});
};

module.exports.loginPatient = async (req, res) => {
	const { email } = req.body;
	const patientAcc = await PatientUser.findOne({ email });
	res.json(patientAcc);
};

module.exports.loginFailRoute = (req, res) => {
	res.redirect('http://localhost:3000/patient/login');
};

module.exports.getAllDoctors = async (req, res) => {
	const doctorDetails = await DoctorDetails.find();
	res.json(doctorDetails);
};
