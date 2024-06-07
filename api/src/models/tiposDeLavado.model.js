const mongoose = require("mongoose");

const tiposDeLavadoSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, "El campo Titulo es obligatorio"],
  },
  descripcion: {
    type: String,
    required: [true, "El campo Descripcion es obligatorio"],
  },
  precio: {
    type: Number,
    required: [true, "El campo Precio es obligatorio"],
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

const TiposDeLavadosModel = mongoose.model("TiposDeLavados", tiposDeLavadoSchema);

module.exports = TiposDeLavadosModel;
