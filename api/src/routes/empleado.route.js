const express = require("express");
const router = express.Router();
const {
  postEmpleado,
  getEmpleadoList,
  getEmpleadoById,
  findEmpleado,
  findEmpleadoByLavadosDate,
  updateEmpleado,
  updateAdminEmpleado,
  updateActiveEmpleado,
  createPassword
} = require("../controllers/empleado.controller");

router.get("/empleados", getEmpleadoList);
router.get("/empleado/:id", getEmpleadoById);
router.get("/empleado", findEmpleado);
router.get("/empleadolavado", findEmpleadoByLavadosDate);
router.put("/empleados/:id", updateEmpleado);
router.put("/empleadopassword/:id", createPassword)
router.post("/empleado", postEmpleado);
router.patch("/empleado/:id", updateActiveEmpleado);
router.patch("/empleadoadmin/:id", updateAdminEmpleado);

module.exports = router;
