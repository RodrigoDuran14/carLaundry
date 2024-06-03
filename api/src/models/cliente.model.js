const mongoose = require("mongoose");

const clienteSchema = new mongoose.Schema({
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
  vehiculos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehiculo",
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
  horarioInicio: {
    type: Date,
    default: Date,
    required: true,
  },
  horarioFin: {
    type: Date,
    required: true,
  },
  lavador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Empleado",
    required: true,
  },
  estadoDelLavado: {
    type: String,
    enum: ["Pendiente", "En progreso", "Terminado"],
    required: true,
    default: "pendiente",
  },
  activo: {
    type: Boolean,
    default: true,
    required: true,
  },
  tipoLavado: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TiposDeLavados",
      required: true,
    },
  ],
});

const Cliente = mongoose.model("Cliente", clienteSchema);

module.exports = Cliente;
