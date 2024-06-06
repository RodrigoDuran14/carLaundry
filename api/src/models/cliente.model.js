const mongoose = require("mongoose");

const clienteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  dni: {
    type: Number,
    required: true,
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
    required: true,
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
