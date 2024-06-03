const express = require("express");
const { getClientList } = require("../controllers/entidad.controller.js");
const router = express.Router();

//aqui definimos las rutas de mi entidad
//router.get('/lista', obtenerLista)
router.get("/cliente", getClientList);

module.exports = router;
