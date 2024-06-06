const mongoose = require("mongoose");

const vehiculoSchema = new mongoose.Schema({
  marca: {
    type: String,
    required: [true, "El campo Marca es obligatorio"],
  },
  modelo: {
    type: String,
    required: [true, "El campo Modelo es obligatorio"],
  },
  matricula: {
    type: String,
    required: [true, "El campo Matricula es obligatorio"],
    unique: true
  },
  color: {
    type: String,
    required: [true, "El campo Color es obligatorio"],
  },
  tipo: {
    type: String,
    enum: ["Auto", "Camioneta", "Furgon", "Moto", "Camion"],
    required: [true, "El campo Tipo es obligatorio"],
  },
  activo: {
    type: Boolean,
    required: true,
    default: true,
  },
});

const VehiculosModel = mongoose.model("Vehiculos", vehiculoSchema);

module.exports = VehiculosModel;
