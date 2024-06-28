const express = require('express');
const {
	addComment,
	getAllComments,
    deleteComment,
} = require('../controllers/reviewControllers');
const router = express.Router();

router.route('/delete/:reviewId').delete(deleteComment);
router.route('/:doctorId').get(getAllComments);
router.route('/:userId/:doctorId').post(addComment);

module.exports = router;
