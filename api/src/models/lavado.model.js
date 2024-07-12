const mongoose = require('mongoose')

const lavadoSchema = new mongoose.Schema({
  horarioInicio: {
    type: Date,
  },
  horarioFin: {
    type: Date,
  },
  total: {
    type: Number,
  },
  lavador: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Empleados",
  }],
  estadoDelLavado: {
    type: String,
    enum: ["Pendiente", "En progreso", "Terminado"],
    required: true,
    default: "Pendiente",
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
    ref: "Vehiculos",
    required: true
  },
  activo: {
    type: Boolean,
    default: true,
    required: true,
  },
},{
  timestamps:true,
  versionKey:false
})

const LavadosModel = mongoose.model("Lavados", lavadoSchema);

module.exports = LavadosModel;