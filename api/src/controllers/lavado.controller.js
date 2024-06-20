const LavadosModel = require("../models/lavado.model");
const TiposDeLavadosModel = require("../models/tiposDeLavado.model");

const postLavados = async (req, res, next) => {
  try {
    const { tipoLavado, clienteId, vehiculoId } = req.body;

    const tipoLavados = await TiposDeLavadosModel.find({
      _id: { $in: tipoLavado },
    });
    if (!tipoLavados || tipoLavados.length == 0) {
      return res.status(404).send({ error: "Tipos de lavado no encontrados" });
    }

    const total = tipoLavados.reduce(
      (suma, tipoLavado) => suma + tipoLavado.precio,
      0
    );

    const newLavado = new LavadosModel({
      tipoLavado,
      clienteId,
      vehiculoId,
      estadoDelLavado: "Pendiente",
      total: total,
    });

    await newLavado.save();
    res.status(201).send(newLavado);
  } catch (error) {
    next(error);
  }
};

const inicioLavado = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { lavador } = req.body;

    const lavado = await LavadosModel.findById(id);
    if (!lavado) {
      return res.status(404).send({ error: "Lavado no encontrado" });
    }

    lavado.estadoDelLavado = "En progreso";
    lavado.lavador = lavador;
    lavado.horarioInicio = Date.now();

    await lavado.save();

    res.status(200).send(lavado);
  } catch (error) {
    next(error);
  }
};

const finalizarLavado = async (req, res, next) => {
  try {
    const { id } = req.params;

    const lavado = await LavadosModel.findById(id);
    if (!lavado) {
      return res.status(404).send({ error: "Lavado no encontrado" });
    }

    lavado.estadoDelLavado = "Terminado";
    lavado.horarioFin = Date.now();

    await lavado.save();

    res.status(200).send(lavado);
  } catch (error) {
    next(error);
  }
};

const getLavadoList = async (req, res, next) => {
  try {
    const allLavados = await LavadosModel.find();
    res.status(200).send(allLavados);
  } catch (error) {
    next(error);
  }
};

module.exports = { postLavados, inicioLavado, finalizarLavado, getLavadoList };
