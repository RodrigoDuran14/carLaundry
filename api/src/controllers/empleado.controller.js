const EmpleadosModel = require("../models/Empleado.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const postEmpleado = async (req, res, next) => {
  try {
    const { nombre, dni, mail, celular } = req.body;

    const newEmpleado = new EmpleadosModel({
      nombre,
      dni,
      mail,
      celular,
    });

    await newEmpleado.save();
    res.status(201).send(newEmpleado);
  } catch (error) {
    next(error);
  }
};

const getEmpleadoList = async (req, res, next) => {
  try {
    const allEmpleados = await EmpleadosModel.find().populate({
      path: "lavados",
      populate: {
        path: "clienteId",
        populate: {
          path: "vehiculo",
          model: "Vehiculos",
          select: "marca modelo matricula color tipo", // Campos a incluir del vehículo
        },
        model: "Cliente",
        select: "nombre dni mail celular", // Campos a incluir del cliente
      },
      select: "horarioInicio horarioFin total ", // Campos a incluir del lavado
    });
    res.status(200).send(allEmpleados);
  } catch (error) {
    next(error);
  }
};

const getEmpleadoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const empleado = await EmpleadosModel.findById({ _id: id }).populate(
      {
        path: "lavados",
        populate: {
          path: "clienteId",
          populate: {
            path: "vehiculo",
            model: "Vehiculos",
            select: "marca modelo matricula color tipo", // Campos a incluir del vehículo
          },
          model: "Cliente",
          select: "nombre dni mail celular", // Campos a incluir del cliente
        },
        select: "horarioInicio horarioFin total ", // Campos a incluir del lavado
      }
    );
    !empleado ? res.status(404).send() : res.status(200).send(empleado);
  } catch (error) {
    next(error);
  }
};

const findEmpleado = async (req, res, next) => {
  try {
    const { nombre, dni, mail, celular } = req.query;

    let empleadoQuery = {};
    if (nombre) empleadoQuery.nombre = new RegExp(nombre, "i");
    if (mail) empleadoQuery.mail = new RegExp(mail, "i");
    if (dni) empleadoQuery.dni = Number(dni);
    if (celular) empleadoQuery.celular = Number(celular);

    const empleado = await EmpleadosModel.find(empleadoQuery).populate(
      {
        path: "lavados",
        populate: {
          path: "clienteId",
          populate: {
            path: "vehiculo",
            model: "Vehiculos",
            select: "marca modelo matricula color tipo", // Campos a incluir del vehículo
          },
          model: "Cliente",
          select: "nombre dni mail celular", // Campos a incluir del cliente
        },
        select: "horarioInicio horarioFin total ", // Campos a incluir del lavado
      }
    );

    res.status(200).send(empleado);
  } catch (error) {
    next(error);
  }
};

const updateEmpleado = async (req, res, next) => {
  try {
    const { id } = req.params;
    const update = req.body;

    if(update.admin && updatepassword){
      const saltRounds = 10
      const hashedPassword = await bcrypt.hash(update.password, saltRounds)
      update.password = hashedPassword
    }else{
      delete update.password
    }

    const updateEmpleado = await EmpleadosModel.findByIdAndUpdate(id, {
      $set: update,
    });

    if (!updateEmpleado) {
      return res.status(404).send({ error: "Empleado no encontrado" });
    }

    res.status(200).send(update);
  } catch (error) {
    next(error);
  }
};

const updateActiveEmpleado = async (req, res, next) => {
  try {
    const { id } = req.params;
    const empleado = await EmpleadosModel.findById(id).populate(
      {
        path: "lavados",
        populate: {
          path: "clienteId",
          populate: {
            path: "vehiculo",
            model: "Vehiculos",
            select: "marca modelo matricula color tipo", // Campos a incluir del vehículo
          },
          model: "Cliente",
          select: "nombre dni mail celular", // Campos a incluir del cliente
        },
        select: "horarioInicio horarioFin total ", // Campos a incluir del lavado
      }
    );

    if (!empleado) {
      return res.status(404).send({ error: "Empleado no encontrado" });
    }

    empleado.activo = !empleado.activo;

    await empleado.save();
    res.status(200).send(empleado);
  } catch (error) {
    next(error);
  }
};

const updateAdminEmpleado = async (req, res, next) => {
  try {
    const { id } = req.params;
    const empleado = await EmpleadosModel.findById(id).populate(
      {
        path: "lavados",
        populate: {
          path: "clienteId",
          populate: {
            path: "vehiculo",
            model: "Vehiculos",
            select: "marca modelo matricula color tipo", // Campos a incluir del vehículo
          },
          model: "Cliente",
          select: "nombre dni mail celular", // Campos a incluir del cliente
        },
        select: "horarioInicio horarioFin total ", // Campos a incluir del lavado
      }
    );

    if (!empleado) {
      return res.status(404).send({ error: "Empleado no encontrado" });
    }

    if (empleado.admin) {
      empleado.password = "";
    }

    empleado.admin = !empleado.admin;

    await empleado.save();
    res.status(200).send(empleado);
  } catch (error) {
    next(error);
  }
};

const createPassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).send("El campo password es obligatorio");
    }

    const empleado = await EmpleadosModel.findById(id);

    if (!empleado) {
      return res.status(404).send({ error: "Empleado no encontrado" });
    }

    if (!empleado.admin) {
      return res
        .status(403)
        .send("Acceso denegado. El empleado no es administrador");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    empleado.password = hashedPassword;

    await empleado.save();
    res.status(200).send({
      message: "Contraseña actualizada correctamente",
      empleado: { id: empleado._id, nombre: empleado.nombre },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { mail, password } = req.body;

    if (!mail || !password) {
      return res
        .status(400)
        .send({ error: "Mail y contraseña son obligatorios" });
    }

    const empleado = await EmpleadosModel.findOne({ mail });

    if (!empleado) {
      return res.status(404).send({ error: "Empleado no encontrado" });
    }

    const isPasswordValid = await bcrypt.compare(password, empleado.password);

    if (!isPasswordValid) {
      return res.status(401).send({ error: "Contraseña incorrecta" });
    }

    if (!empleado.activo) {
      return res.status(403).send({ error: "Empleado inactivo" });
    }

    const tokenPayload = {
      id: empleado._id,
      mail: empleado.mail,
      admin: empleado.admin,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).send({
      message: "Inicio de sesión exitoso",
      token,
      empleado: {
        id: empleado._id,
        nombre: empleado.nombre,
        mail: empleado.mail,
        admin: empleado.admin,
        activo: empleado.activo,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  postEmpleado,
  getEmpleadoList,
  getEmpleadoById,
  findEmpleado,
  updateEmpleado,
  updateActiveEmpleado,
  updateAdminEmpleado,
  createPassword,
  login,
};
