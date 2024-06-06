const express = require('express')
const router = express.Router()
const postTipoLavado = require('../controllers/tiposLavado.controller')

router.post('/tiposLavado', postTipoLavado)

module.exports = router