const express = require("express");
const router = express.Router();
const {
  postTipoLavado,
  getTiposLavadoList,
  getTiposLavadoById,
  findTiposLavado,
  updateTiposLavado,
  updateActiveTiposLavado
} = require("../controllers/tiposLavado.controller");

router.get("/tiposLavados", getTiposLavadoList);
router.get("/tiposLavado/:id", getTiposLavadoById);
router.get("/tiposLavado", findTiposLavado);
router.post("/tiposLavado", postTipoLavado);
router.put("/tiposLavado/:id", updateTiposLavado)
router.patch("/tiposLavado/:id", updateActiveTiposLavado)

module.exports = router;
