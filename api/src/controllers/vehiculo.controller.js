const VehiculosModel = require("../models/vehiculo.model");

const postVehiculo = async (req, res, next) => {
  try {
    const { marca, modelo, matricula, color, tipo } = req.body;

    const newVehiculo = new VehiculosModel({
      marca,
      modelo,
      matricula,
      color,
      tipo,
    });

    await newVehiculo.save();
    res.status(201).send(newVehiculo);
  } catch (error) {
    next(error);
  }
};

const getVehiculoList = async (req, res, next) => {
  try {
    const allVehiculo = await VehiculosModel.find();

    return res.status(200).send(allVehiculo);
  } catch (error) {
    next(error);
  }
};

const getVehiculoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vehiculos = await VehiculosModel.findById({ _id: id });

    !vehiculos ? res.status(400).send() : res.status(200).send(vehiculos);
  } catch (error) {
    next(error);
  }
};

const findVehiculo = async (req, res, next) => {
  try {
    const { marca, modelo, matricula, color, tipo } = req.query;

    let vehiculoQuery = {};
    if (marca) vehiculoQuery.marca = new RegExp(marca, "i");
    if (modelo) vehiculoQuery.modelo = new RegExp(modelo, "i");
    if (matricula) vehiculoQuery.matricula = new RegExp(matricula, "i");
    if (color) vehiculoQuery.color = new RegExp(color, "i");
    if (tipo) vehiculoQuery.tipo = new RegExp(tipo, "i");

    const vehiculos = await VehiculosModel.find(vehiculoQuery);

    res.status(200).send(vehiculos);
  } catch (error) {
    next(error);
  }
};

const updateVehiculo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const update = req.body;

    const updateVehiculo = await VehiculosModel.findByIdAndUpdate(id, {
      $set: update,
    });

    if (!updateVehiculo) {
      return res.status(404).send({ error: "Vehiculo no encontrado" });
    }

    res.status(200).send(update);
  } catch (error) {
    next(error);
  }
};

const updateActiveVehiculo = async (req, res, next) => {
  try {
    const { id } = req.params;

    const vehiculo = await VehiculosModel.findById(id);

    if (!vehiculo) {
      return res.status(404).send({ error: "Vehiculo no encontrado" });
    }

    vehiculo.activo = !vehiculo.activo;

    await vehiculo.save();

    res.status(200).send(vehiculo);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  postVehiculo,
  getVehiculoList,
  getVehiculoById,
  findVehiculo,
  updateVehiculo,
  updateActiveVehiculo,
};
