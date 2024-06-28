const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const PatientUser = require('./models/patientUser');
const DoctorUser = require('./models/doctorUser');
const session = require('express-session');
const cors = require('cors');
const doctorRoutes = require('./routes/doctorRoutes');
const patientRoutes = require('./routes/patientRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

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
app.use(
	cors({
		origin: ['https://docmap-fe.vercel.app/', 'https://docmap-fe-yash-sharmas-projects-e4333b95.vercel.app/'],
		default: 'https://docmap-fe.vercel.app/',
		credentials: true,
		method: 'GET, POST, PUT, DELETE',
	}),
);

const sessionConfig = {
	secret: 'ThisIsaSecret',
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7,
	},
};

app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());

passport.use(
	'local-patient',
	new LocalStrategy({ usernameField: 'email' }, PatientUser.authenticate()),
);
passport.serializeUser(PatientUser.serializeUser());
passport.deserializeUser(PatientUser.deserializeUser());

passport.use(
	'local-doctor',
	new LocalStrategy({ usernameField: 'email' }, DoctorUser.authenticate()),
);
passport.serializeUser(DoctorUser.serializeUser());
passport.deserializeUser(DoctorUser.deserializeUser());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
});

// =================================================================================================================

app.get('/check-auth', (req, res) => {
	console.log('req.isAuthenticated(): ', req.isAuthenticated());
	res.json({ isAuthenticated: req.isAuthenticated() });
});

// -------------------------------------------------- PATIENT -------------------------------------------------------
app.use('/patient', patientRoutes);

// ---------------------------------------------------- DOCTOR -------------------------------------------------------
app.use('/doctor', doctorRoutes);

app.use('/review', reviewRoutes);

app.use('/appointment', appointmentRoutes);

//

app.listen(3001, () => {
	console.log('============ LISTENING TO PORT 3001 =============');
});
