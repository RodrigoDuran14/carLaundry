const mongoose = require("mongoose");

const empleadoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, "El campo Nombre es obligatorio"],
  },
  dni: {
    type: Number,
    required: [true, "El campo Dni es obligatorio"],
  },
  mail: {
    type: String,
    required: [true, "El campo Mail es obligatorio"],
    unique: true
  },
  celular: {
    type: Number,
    required: [true, "El campo Celular es obligatorio"],
  },
  password: {
    type: String,
  },
  lavados: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lavados",
  }],
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
},{
  timestamps:true,
  versionKey:false
});

const EmpleadosModel = mongoose.model("Empleados", empleadoSchema);

module.exports = EmpleadosModel;