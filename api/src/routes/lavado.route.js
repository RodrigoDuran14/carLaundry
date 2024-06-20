const express = require("express")
const router = express.Router()
const {postLavados, inicioLavado, finalizarLavado, getLavadoList} = require("../controllers/lavado.controller")

router.get("/lavados", getLavadoList)
router.post("/lavado", postLavados)
router.patch("/lavado/:id/inicio", inicioLavado)
router.patch("/lavado/:id/fin", finalizarLavado)

module.exports= router