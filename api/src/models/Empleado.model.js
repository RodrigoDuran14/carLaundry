const mongoose = require("mongoose");

const empleadoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  dni: {
    type: Number,
    required: true,
  },
  mail: {
    type: String,
    required: true,
  },
  celular: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
  },
  lavados: {
    type: Number,
  },
  admin: {
    type: Boolean,
    required: true,
    default: false,
  },
  activo: {
    type: Boolean,
    default: true,
    required: true,
  },
});

const EmpleadosModel = mongoose.model("Empleados", empleadoSchema);

module.exports = EmpleadosModel;