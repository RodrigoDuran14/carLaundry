const mongoose = require('mongoose')

const lavadoSchema = new mongoose.Schema({
  horarioInicio: {
    type: Date,
  },
  horarioFin: {
    type: Date,
  },
  lavador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Empleado",
    required: true
  },
  estadoDelLavado: {
    type: String,
    enum: ["Pendiente", "En progreso", "Terminado"],
    required: true,
    default: "pendiente",
  },
  tipoLavado: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TiposDeLavados",
      required: true,
    },
  ],
  clienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cliente",
    required: true
  },
  vehiculoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehiculo",
    required: true
  },
  activo: {
    type: Boolean,
    default: true,
    required: true,
  },
})