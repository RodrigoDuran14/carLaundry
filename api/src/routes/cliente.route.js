const express = require('express')
const router = express.Router()
const {getClientList, getClientById, postClient} = require('../controllers/cliente.controller')

router.get('/cliente', getClientList )
router.get('/cliente/:id', getClientById)
router.post('/cliente', postClient)

module.exports = router