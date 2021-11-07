const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

const auth = require('../middleware/auth');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/:id', auth, userCtrl.getUserAccount);
router.put('/:id', auth, userCtrl.modifyUserAccount);
router.delete('/:id', auth, userCtrl.deleteUserAccount);

module.exports = router;