const express = require("express")
const router = express.Router()
const {postEmpleado,getEmpleadoList,getEmpleadoById,findEmpleado,findEmpleadoByLavadosDate} = require("../controllers/empleado.controller")

router.get("/empleados", getEmpleadoList)
router.get("/empleado/:id", getEmpleadoById)
router.get("/empleado", findEmpleado)
router.get("/empleadolavado", findEmpleadoByLavadosDate)

router.post("/empleado", postEmpleado)

module.exports = router