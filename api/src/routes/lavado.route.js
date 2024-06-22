const express = require("express");
const router = express.Router();
const {
  postLavados,
  inicioLavado,
  finalizarLavado,
  getLavadoList,
  updateLavado,
  getLavadoById,
  updateActiveLavado,
  findLavado,
  findLavadoByDate
} = require("../controllers/lavado.controller");

router.post("/lavado", postLavados);
router.get("/lavados", getLavadoList);
router.get("/lavado", findLavado);
router.get("/lavadosDate", findLavadoByDate);
router.get("/lavados/:id", getLavadoById);
router.put("/lavados/:id", updateLavado);
router.patch("/lavado/:id/inicio", inicioLavado);
router.patch("/lavado/:id/fin", finalizarLavado);
router.patch("/lavados/:id", updateActiveLavado);

module.exports = router;
