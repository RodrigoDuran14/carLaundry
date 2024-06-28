const ClienteModel = require("../models/cliente.model");
const VehiculosModel = require("../models/vehiculo.model");

const getClientList = async (req, res, next) => {
  try {
    const allClients = await ClienteModel.find().populate(
      "vehiculo",
      "marca modelo matricula tipo"
    );

    res.status(200).send(allClients);
  } catch (error) {
    next(error);
  }
};

const getClientById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const client = await ClienteModel.findById({ _id: id }).populate(
      "vehiculo",
      "marca modelo matricula tipo color"
    );

    !client ? res.status(404).send({error: "Cliente no encontrado"}) : res.status(200).send(client);
  } catch (error) {
    next(error);
  }
};

const getClientsByName = async (req, res, next) => {
  try {
    const { nombre, dni, celular } = req.query;

    let query = {};
    if (nombre) query.nombre = new RegExp(nombre, "i");
    if (dni) query.dni = Number(dni);
    if (celular) query.celular = Number(celular);

    const cliente = await ClienteModel.find(query).populate(
      "vehiculo",
      "marca modelo matricula tipo color"
    );
    res.status(200).send(cliente);
  } catch (error) {
    next(error);
  }
};

const getClientsByVehiculo = async (req, res, next) => {
  try {
    const { marca, modelo, matricula } = req.query;

    let vehiculoQuery = {};
    if (marca) vehiculoQuery.marca = new RegExp(marca, "i");
    if (modelo) vehiculoQuery.modelo = new RegExp(modelo, "i");
    if (matricula) vehiculoQuery.matricula = new RegExp(matricula, "i");

    if (Object.keys(vehiculoQuery).length === 0) {
      return res.status(400).send({
        error:
          "Se requiere al menos un parámetro de búsqueda (marca, modelo o matricula)",
      });
    }

    const vehiculos = await VehiculosModel.find(vehiculoQuery);
    const vehiculoId = vehiculos.map((v) => v._id);

    if (vehiculoId.length === 0) {
      return res.status(404).send({
        error: "No se encontraron vehículos con los parámetros proporcionados",
      });
    }

    const clientes = await ClienteModel.find({
      vehiculo: { $in: vehiculoId },
    }).populate("vehiculo", "marca modelo matricula tipo color");

    res.status(200).send(clientes);
  } catch (error) {
    next(error);
  }
};

const postClient = async (req, res, next) => {
  try {
    const { nombre, dni, vehiculoId, celular, mail } = req.body;

    const vehiculo = await VehiculosModel.find({ _id: vehiculoId });
    if (!vehiculo) {
      return res
        .status(404)
        .send({ error: "Uno o mas vehiculos no encontrados" });
    }

    if ((!nombre, !dni, !vehiculo, !celular)) {
      return res
        .status(404)
        .send({ error: "Todos los campos son obligatorios" });
    }

    const newClient = new ClienteModel({
      nombre,
      dni,
      vehiculo: vehiculoId,
      celular,
      mail,
    });

    await newClient.save();
    res.status(201).send(newClient);
  } catch (error) {
    next(error);
  }
};

const updateClient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const update = req.body;

    const updateClient = await ClienteModel.findByIdAndUpdate(id, {
      $set: update,
    });

    if (!updateClient) {
      return res.status(404).send({ error: "Cliente no encontrado" });
    }

    res.status(200).send(update);
  } catch (error) {
    next(error);
  }
};

const updateActiveClient = async (req, res, next) => {
  try {
    const { id } = req.params;

    const client = await ClienteModel.findById(id);

    if (!client) {
      return res.status(404).send({ error: "Cliente no encontrado" });
    }

    client.activo = !client.activo;

    await client.save();

    res.status(200).send(client);
  } catch (error) {
    next(error);
  }
};

const addVehiculo = async (req,res,next) =>{
  const {clienteId,vehiculoId} = req.body

  try {
    const vehiculo = await VehiculosModel.findById(vehiculoId);
    if (!vehiculo) {
      return res.status(404).json({ error: "El vehículo no existe" });
    }

    const cliente = await ClienteModel.findById(clienteId);
    if (!cliente) {
      return res.status(404).json({ error: "El cliente no existe" });
    }

    if (!cliente.vehiculo.includes(vehiculoId)) {
      cliente.vehiculo.push(vehiculoId );
      await cliente.save();
      res.status(200).json({ message: "Vehículo agregado exitosamente al cliente" });
    } else {
      res.status(400).json({ error: "El vehículo ya está asociado a este cliente" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al agregar el vehículo al cliente" });
  }
}

module.exports = {
  getClientList,
  getClientById,
  postClient,
  getClientsByName,
  getClientsByVehiculo,
  updateClient,
  updateActiveClient,
  addVehiculo
};
