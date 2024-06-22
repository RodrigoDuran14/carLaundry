const LavadosModel = require("../models/lavado.model");
const TiposDeLavadosModel = require("../models/tiposDeLavado.model");
const EmpleadosModel = require("../models/Empleado.model");

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
    lavado.lavador.push(lavador);
    lavado.horarioInicio = Date.now();

    await lavado.save();

    const empleado = await EmpleadosModel.findById(lavador);
    empleado.lavados.push(id);
    await empleado.save();

    res.status(200).send(lavado);
  } catch (error) {
    next(error);
  }
};

const finalizarLavado = async (req, res, next) => {
  try {
    const { id } = req.params;

    const lavado = await LavadosModel.findById(id).populate(
      "clienteId vehiculoId lavador"
    );
    if (!lavado) {
      return res.status(404).send({ error: "Lavado no encontrado" });
    }

    lavado.estadoDelLavado = "Terminado";
    lavado.horarioFin = Date.now();

    await lavado.save();

    //falta configuracion para notificar al cliente
    const cliente = lavado.clienteId;

    res.status(200).send(lavado);
  } catch (error) {
    next(error);
  }
};

const getLavadoList = async (req, res, next) => {
  try {
    const allLavados = await LavadosModel.find()
      .populate("lavador", "nombre dni mail")
      .populate("clienteId", "nombre dni mail celular")
      .populate("vehiculoId", "marca modelo matricula color tipo")
      .populate("tipoLavado", "titulo descripcion precio");
    res.status(200).send(allLavados);
  } catch (error) {
    next(error);
  }
};

const getLavadoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lavado = await LavadosModel.findById({ _id: id })
      .populate("lavador", "nombre dni mail")
      .populate("clienteId", "nombre dni mail celular")
      .populate("vehiculoId", "marca modelo matricula color tipo")
      .populate("tipoLavado", "titulo descripcion precio");

    !lavado
      ? res.status(404).send({ error: "Lavado no encontrado" })
      : res.status(200).send(lavado);
  } catch (error) {
    next(error);
  }
};

const updateLavado = async (req, res, next) => {
  try {
    const { id } = req.params;
    const update = req.body;

    if (update.tipoLavado && update.tipoLavado.length > 0) {
      const tiposDeLavado = await TiposDeLavadosModel.find({
        _id: { $in: update.tipoLavado },
      });

      const nuevoTotal = tiposDeLavado.reduce(
        (total, tipo) => total + tipo.precio,
        0
      );

      update.total = nuevoTotal;
    }

    const updateLavado = await LavadosModel.findByIdAndUpdate(id, {
      $set: update,
    });
    if (!updateLavado) {
      return res.status(404).send({ error: "Lavado no encontrado" });
    }

    res.status(200).send(update);
  } catch (error) {
    next(error);
  }
};

const updateActiveLavado = async (req, res, next) => {
  try {
    const { id } = req.params;

    const lavado = await LavadosModel.findById(id);

    if (!lavado) {
      return res.status(404).send({ error: "Lavado no encontrado" });
    }

    lavado.activo = !lavado.activo;

    await lavado.save();

    res.status(200).send(lavado);
  } catch (error) {
    next(error);
  }
};

const findLavado = async (req, res, next) => {
  try {
    const { lavador, cliente, matricula } = req.query;
    try {
      const query = {};
      if (lavador) {
        query["lavador.nombre"] = new RegExp(lavador, "i");
      }
      if (cliente) {
        query["clienteId.nombre"] = new RegExp(cliente, "i");
      }
      if (matricula) {
        query["vehiculoId.matricula"] = new RegExp(matricula, "i");
      }

      const lavados = await LavadosModel.find(query)
        .populate("clienteId", "nombre dni mail celular")
        .populate("vehiculoId", "marca modelo matricula color tipo")
        .populate("lavador", "nombre mail celular")
        .populate("tipoLavado", "titulo precio");

      res.status(200).send(lavados);
    } catch (error) {
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

const findLavadoByDate = async (req, res, next) => {
  try {
    const { fechaInicio } = req.query;

    const date = new Date(fechaInicio);

    const lavados = await LavadosModel.find({
      horarioInicio: {
        $gte: date,
        $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000),
      },
    })
      .populate("clienteId", "nombre dni mail celular")
      .populate("vehiculoId", "marca modelo matricula color tipo")
      .populate("lavador", "nombre mail celular")
      .populate("tipoLavado", "titulo precio");

    res.status(200).send(lavados);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  postLavados,
  inicioLavado,
  finalizarLavado,
  getLavadoList,
  updateLavado,
  getLavadoById,
  updateActiveLavado,
  findLavado,
  findLavadoByDate,
};
