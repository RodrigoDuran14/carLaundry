const mongoose = require("mongoose");

const tiposDeLavadoSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => {
      return new mongoose.Types.ObjectId().toString();
    },
    required: true,
  },
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

const TiposDeLavados = mongoose.model("TiposDeLavados", tiposDeLavadoSchema);

module.exports = TiposDeLavados;
