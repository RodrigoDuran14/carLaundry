const mongoose = require("mongoose");

const clienteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, "El campo Nombre es obligatorio"],
  },
  dni: {
    type: Number,
    required: [true, "El campo Dni es obligatorio"],
  },
  vehiculo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehiculos",
      required: true,
    },
  ],
  celular: {
    type: Number,
    required: [true, "El campo Celular es obligatorio"],
  },
  mail: {
    type: String,
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

const ClienteModel = mongoose.model("Cliente", clienteSchema);

module.exports = ClienteModel;
