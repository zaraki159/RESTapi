const express = require('express')
const router = express.Router()
const { create, list, remove, listBy, searchFilters, update, read } = require('../controller/product')
const { authCheck, adminCheck } = require('../middleware/authCheck');

router.post('/product', authCheck, adminCheck, create)
router.get('/products/:count', authCheck, list)
router.delete('/product/:id', authCheck, adminCheck, remove)
router.put('/product/:id', authCheck, adminCheck, update)
router.post('/productby', authCheck, listBy)
router.post('/search/filter', authCheck, searchFilters)
router.get('/product/:id', authCheck, read)


module.exports = router