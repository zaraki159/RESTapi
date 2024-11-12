const express = require('express');
const router = express.Router();
const { create, read, remove } = require('../controller/Category')
const { authCheck, adminCheck } = require('../middleware/authCheck');

router.post('/category', authCheck, adminCheck, create)
router.get('/read', authCheck, read)
router.delete('/delete/:id', authCheck, adminCheck, remove)

module.exports = router;