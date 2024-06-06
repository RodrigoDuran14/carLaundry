const express = require('express')
const router = express.Router()
const {postVehiculo, getVehiculoList} = require('../controllers/vehiculo.controller')

router.get('/vehiculo', getVehiculoList )
router.post('/vehiculo', postVehiculo)

module.exports = router