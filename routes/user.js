const express = require('express');
const router = express.Router();
const { authCheck, adminCheck } = require('../middleware/authCheck');
const { listUsers,
    changeStatus,
    changeRole,
    userCart,
    getuserCart,
    deleteuserCart,
    Address,
    saveOder,
    getUser
} = require('../controller/user');

router.get('/users', authCheck, adminCheck, listUsers)
router.post('/change-status', authCheck, adminCheck, changeStatus)
router.post('/change-role', authCheck, adminCheck, changeRole)

router.get('/users/cart', authCheck, getuserCart)
router.post('/users/cart', authCheck, userCart)
router.delete('/users/cart', authCheck, deleteuserCart)

router.post('/users/address', authCheck, Address)

router.post('/users/order', authCheck, saveOder)
router.get('/users/order', authCheck, getUser)

module.exports = router