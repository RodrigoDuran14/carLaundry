const express = require("express");
const router = express.Router();
const {
  postEmpleado,
  getEmpleadoList,
  getEmpleadoById,
  findEmpleado,
  updateEmpleado,
  updateAdminEmpleado,
  updateActiveEmpleado,
  createPassword,
  login
} = require("../controllers/empleado.controller");

router.get("/empleados", getEmpleadoList);
router.get("/empleado/:id", getEmpleadoById);
router.get("/empleado", findEmpleado);
router.put("/empleados/:id", updateEmpleado);
router.put("/empleadopassword/:id", createPassword)
router.post("/empleado", postEmpleado);
router.patch("/empleado/:id", updateActiveEmpleado);
router.patch("/empleadoadmin/:id", updateAdminEmpleado);
router.post("/login", login)

module.exports = router;
