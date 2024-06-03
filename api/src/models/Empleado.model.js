const mongoose = require("mongoose");

const empleadoSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => {
      return new mongoose.Types.ObjectId().toString();
    },
    required: true,
  },
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

const Empleados = mongoose.model("Empleados", empleadoSchema);

module.exports = Empleados;