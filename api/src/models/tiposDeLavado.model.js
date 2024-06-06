const mongoose = require("mongoose");

const tiposDeLavadoSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
  activo: {
    type: Boolean,
    default: true,
    required: true,
  },
});

const TiposDeLavadosModel = mongoose.model("TiposDeLavados", tiposDeLavadoSchema);

module.exports = TiposDeLavadosModel;
