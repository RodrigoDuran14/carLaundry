const express = require('express')
const router = express.Router()
const {getClientList, getClientById, postClient, getClientsByName, getClientsByVehiculo} = require('../controllers/cliente.controller')

router.get('/cliente', getClientList )
router.get('/cliente/:id', getClientById)
router.get('/clientename', getClientsByName)
router.get('/clientes', getClientsByVehiculo)
router.post('/cliente', postClient)

module.exports = router