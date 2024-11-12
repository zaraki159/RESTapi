const express = require('express');
const router = express.Router();

const { register, login, currentUser } = require('../controller/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/current-user', currentUser);
router.post('/current-admin', currentUser);

module.exports = router;