const { authCheck, adminCheck, } = require('../middleware/authCheck')
const { changeOrder, getOrderAdmin } = require('../controller/admin')
const express = require('express')
const router = express.Router()

router.put('/admin/order-status', authCheck, changeOrder)
router.get('/admin/orders', authCheck, adminCheck, getOrderAdmin)


module.exports = router