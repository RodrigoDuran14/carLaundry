const VehiculosModel = require('../models/vehiculo.model')

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
    console.log("vehiculo list");

    return res.status(200).send(allVehiculo);
  } catch (error) {
    next(error);
  }
};

module.exports = { postVehiculo, getVehiculoList };
