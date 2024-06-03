const mongoose = require('mongoose')

const vehiculoSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => {
      return new mongoose.Types.ObjectId().toString();
    },
    required: true,
  },
  marca: {
    type: String,
    required: true,
  },
  modelo: {
    type: String,
    required: true,
  },
  matricula: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  tipo: {
    type: String,
    enum: ["Auto", "Camioneta", "Furgon", "Moto", "Camion"],
    required: true,
  },
  activo: {
    type: Boolean,
    required: true,
    default: true
  }
}) 

const Vehiculo = mongoose.model("Vehiculo", vehiculoSchema);

module.exports = Vehiculo;