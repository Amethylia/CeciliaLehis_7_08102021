const express = require('express');
const router = express.Router();

const commentCtrl = require('../controllers/comment');

const auth = require('../middleware/auth');

router.get('/:post_id', auth, commentCtrl.getAllComments);
router.get('/:post_id/:comment_id', auth, commentCtrl.getComment);
router.post('/', auth, commentCtrl.createComment);
router.delete('/:post_id/:comment_id', auth, commentCtrl.deleteComment);

module.exports = router;