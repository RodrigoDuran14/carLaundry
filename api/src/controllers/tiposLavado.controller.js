const TiposDeLavadosModel = require("../models/tiposDeLavado.model");

const postTipoLavado = async (req, res, next) => {
  try {
    const { titulo, descripcion, precio } = req.body;

    const newTipoLavado = new TiposDeLavadosModel({
      titulo,
      descripcion,
      precio,
    });

    await newTipoLavado.save();
    res.status(201).send(newTipoLavado);
  } catch (error) {
    next(error);
  }
};

const getTiposLavadoList = async (req, res, next) => {
  try {
    const allTiposLavado = await TiposDeLavadosModel.find();

    res.status(200).send(allTiposLavado);
  } catch (error) {
    next(error);
  }
};

const getTiposLavadoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tiposLavado = await TiposDeLavadosModel.findById({ _id: id });

    !tiposLavado ? res.status(400).send() : res.status(200).send(tiposLavado);
  } catch (error) {
    next(error);
  }
};

const findTiposLavado = async (req, res, next) => {
  try {
    const { titulo, descripcion, precio } = req.query;

    let tiposLavadoQuery = {};
    if (titulo) tiposLavadoQuery.titulo = new RegExp(titulo, "i");
    if (descripcion)
      tiposLavadoQuery.descripcion = new RegExp(descripcion, "i");
    if (precio) tiposLavadoQuery.precio = new RegExp(precio, "i");

    if (Object.keys(tiposLavadoQuery).length === 0) {
      return res.status(400).send({
        error:
          "Se requiere al menos un parámetro de búsqueda (titulo, descripcion o precio)",
      });
    }

    const tiposLavado = await TiposDeLavadosModel.find(tiposLavadoQuery);
    const tiposLavadoId = tiposLavado.map((t) => t._id);

    if (tiposLavadoId.length === 0) {
      return res.status(404).send({
        error:
          "No se encontraron tipos de lavado con los parámetros proporcionados",
      });
    }

    res.status(200).send(tiposLavado);
  } catch (error) {
    next(error);
  }
};

const updateTiposLavado = async (req, res, next) => {
  try {
    const { id } = req.params;
    const update = req.body;

    const updateTiposLavado = await TiposDeLavadosModel.findByIdAndUpdate(id, {
      $set: update,
    });

    if (!updateTiposLavado) {
      return res.status(404).send({ error: "Tipo de lavado no encontrado" });
    }

    res.status(200).send(update);
  } catch (error) {
    next(error);
  }
};

const updateActiveTiposLavado = async (req, res, next) => {
  try {
    const { id } = req.params;

    const tiposLavado = await TiposDeLavadosModel.findById(id);

    if (!tiposLavado) {
      return res.status(404).send({ error: "Tipo de lavado no encontrado" });
    }

    tiposLavado.activo = !tiposLavado.activo;

    await tiposLavado.save();

    res.status(200).send(tiposLavado);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  postTipoLavado,
  getTiposLavadoList,
  getTiposLavadoById,
  findTiposLavado,
  updateTiposLavado,
  updateActiveTiposLavado,
};
