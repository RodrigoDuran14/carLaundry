const express = require("express");
const router = express.Router();
const {
  getClientList,
  getClientById,
  postClient,
  getClientsByName,
  getClientsByVehiculo,
  updateClient,
  updateActiveClient
} = require("../controllers/cliente.controller");

router.get("/clientes", getClientList);
router.get("/cliente/:id", getClientById);
router.get("/cliente", getClientsByName);
router.get("/clientevehiculo", getClientsByVehiculo);
router.post("/cliente", postClient);
router.put("/cliente/:id", updateClient);
router.patch("/cliente/:id", updateActiveClient)

module.exports = router;
