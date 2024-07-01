if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const doctorRoutes = require('./routes/doctorRoutes');
const patientRoutes = require('./routes/patientRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

// ==================================================================================================================

mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('!!!!!!!!!!!!!! DATABASE CONNECTED !!!!!!!!!!!!!!!');
});

// ==========================================================================================================================

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: true,
		allowedHeaders: ['Content-Type'],
		credentials: true,
		method: ['GET', 'POST', 'PUT', 'DELETE'],
	}),
);

// =================================================================================================================

app.get('/checkAuth', async (req, res) => {
	const {token, doctorToken} = req.cookies;
	if(!token && !doctorToken) return res.json({auth: 0});
	try {
		const verifiedToken = jwt.verify(token, process.env.tokenSecretKey);
		return res.json({auth: 1, userID: verifiedToken.userID});
	} catch (err) {
		console.log("Not a patient");
	}
	try {
		jwt.verify(doctorToken, process.env.tokenSecretKey);
		return res.json({auth: 2});
	} catch (err) {
		console.log("Not a doctor");
	}
	return res.cookie('token', 'none').cookie('doctorToken', 'none').json({auth: 0});
});

app.get('/logout', (req, res) => {
	res.status(200).cookie('token', 'none').cookie('doctorToken', 'none').json({'message': "Successfully logged out"});
});

// -------------------------------------------------- PATIENT -------------------------------------------------------
app.use('/patient', patientRoutes);

// ---------------------------------------------------- DOCTOR -------------------------------------------------------
app.use('/doctor', doctorRoutes);

app.use('/review', reviewRoutes);

app.use('/appointment', appointmentRoutes);


app.listen(process.env.PORT, () => {
	console.log(`============ LISTENING TO PORT ${process.env.PORT} =============`);
});
