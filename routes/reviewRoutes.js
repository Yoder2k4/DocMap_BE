const express = require('express');
const {
	addComment,
	getAllComments,
    deleteComment,
} = require('../controllers/reviewControllers');
const patientAuth = require('../middleware/patientAuth');
const router = express.Router();

router.route('/delete/:reviewID').delete(deleteComment);
router.route('/:doctorID').get(getAllComments);
router.route('/:doctorID').post(patientAuth, addComment);

module.exports = router;
