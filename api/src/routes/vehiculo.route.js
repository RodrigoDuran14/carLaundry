const express = require("express");
const router = express.Router();
const {
  postVehiculo,
  getVehiculoList,
  getVehiculoById,
  findVehiculo,
  updateVehiculo,
  updateActiveVehiculo,
} = require("../controllers/vehiculo.controller");

router.get("/vehiculos", getVehiculoList);
router.get("/vehiculo/:id", getVehiculoById);
router.get("/vehiculo", findVehiculo);
router.post("/vehiculo", postVehiculo);
router.put("/vehiculo/:id", updateVehiculo);
router.patch("/vehiculo/:id", updateActiveVehiculo);

module.exports = router;
