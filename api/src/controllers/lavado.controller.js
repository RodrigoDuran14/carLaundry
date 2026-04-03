const LavadosModel = require("../models/lavado.model");
const TiposDeLavadosModel = require("../models/tiposDeLavado.model");
const EmpleadosModel = require("../models/Empleado.model");
const { sendEmail } = require("../services/resendClient");
const { getClient } = require("../services/venomClient");
require("dotenv").config();

const postLavados = async (req, res, next) => {
  try {
    const { tipoLavado, clienteId, vehiculoId, lavador, iniciarAhora, observaciones } = req.body;

    // Validar tipos de lavado
    const tipoLavados = await TiposDeLavadosModel.find({
      _id: { $in: tipoLavado },
    });
    if (!tipoLavados || tipoLavados.length == 0) {
      return res.status(404).send({ error: "Tipos de lavado no encontrados" });
    }

    // Calcular total
    const total = tipoLavados.reduce(
      (suma, tipoLavado) => suma + tipoLavado.precio,
      0
    );

    // Determinar estado y horario de inicio
    const estadoDelLavado = iniciarAhora ? "En progreso" : "Pendiente";
    const horarioInicio = iniciarAhora ? Date.now() : null;

    // Crear lavado
    const newLavado = new LavadosModel({
      tipoLavado,
      clienteId,
      vehiculoId,
      lavador: lavador || [],
      estadoDelLavado,
      horarioInicio,
      total: total,
      observaciones: observaciones || '',
    });

    await newLavado.save();

    // Si hay lavadores, actualizar sus registros
    if (lavador && lavador.length > 0) {
      for (const lavadorId of lavador) {
        const empleado = await EmpleadosModel.findById(lavadorId);
        if (empleado) {
          empleado.lavados.push(newLavado._id);
          await empleado.save();
        }
      }
    }

    // Populate para la respuesta
    const lavadoCompleto = await LavadosModel.findById(newLavado._id)
      .populate("lavador", "nombre dni mail")
      .populate("clienteId", "nombre dni mail celular")
      .populate("vehiculoId", "marca modelo matricula color tipo")
      .populate("tipoLavado", "titulo descripcion precio");

    res.status(201).send(lavadoCompleto);
  } catch (error) {
    next(error);
  }
};

const inicioLavado = async (req, res, next) => {
  try {
    const { id } = req.params;
    let { lavadores, reemplazar } = req.body;

    console.log("ID del lavado:", id);
    console.log("Lavadores recibidos del cuerpo:", lavadores);
    console.log("Reemplazar:", reemplazar);

    if (!Array.isArray(lavadores)) {
      lavadores = [lavadores];
    }

    const lavado = await LavadosModel.findById(id)
      .populate("lavador", "nombre dni mail")
      .populate("clienteId", "nombre dni mail celular")
      .populate("vehiculoId", "marca modelo matricula color tipo")
      .populate("tipoLavado", "titulo descripcion precio");

    if (!lavado) {
      return res.status(404).send({ error: "Lavado no encontrado" });
    }

    // Si ya tiene lavadores y se quiere reemplazar
    if (lavado.lavador && lavado.lavador.length > 0 && reemplazar) {
      // Eliminar el lavado de los empleados anteriores
      for (const lavadorAntiguo of lavado.lavador) {
        const empleado = await EmpleadosModel.findById(lavadorAntiguo._id);
        if (empleado) {
          empleado.lavados = empleado.lavados.filter(
            (l) => l.toString() !== id
          );
          await empleado.save();
        }
      }
      // Reemplazar con los nuevos
      lavado.lavador = lavadores;
    } else if (lavado.lavador && lavado.lavador.length > 0 && !reemplazar) {
      // Agregar nuevos lavadores a los existentes
      const lavadoresExistentes = lavado.lavador.map(l => l._id.toString());
      const nuevosLavadores = lavadores.filter(l => !lavadoresExistentes.includes(l));
      lavado.lavador = [...lavado.lavador, ...nuevosLavadores];
    } else {
      // No tiene lavadores, asignar los nuevos
      lavado.lavador = lavadores;
    }

    lavado.estadoDelLavado = "En progreso";
    
    // Solo establecer horario de inicio si no existe
    if (!lavado.horarioInicio) {
      lavado.horarioInicio = Date.now();
    }

    await lavado.save();

    // Actualizar los empleados con el nuevo lavado
    for (const lavadorId of lavadores) {
      const empleado = await EmpleadosModel.findById(lavadorId);
      if (empleado && !empleado.lavados.includes(id)) {
        empleado.lavados.push(id);
        await empleado.save();
      }
    }

    // Volver a populate para la respuesta
    const lavadoActualizado = await LavadosModel.findById(id)
      .populate("lavador", "nombre dni mail")
      .populate("clienteId", "nombre dni mail celular")
      .populate("vehiculoId", "marca modelo matricula color tipo")
      .populate("tipoLavado", "titulo descripcion precio");

    res.status(200).send(lavadoActualizado);
  } catch (error) {
    console.error("Error en inicioLavado:", error);
    next(error);
  }
};

const finalizarLavado = async (req, res, next) => {
  try {
    const { id } = req.params;

    const lavado = await LavadosModel.findById(id)
      .populate("lavador", "nombre dni mail")
      .populate("clienteId", "nombre dni mail celular")
      .populate("vehiculoId", "marca modelo matricula color tipo")
      .populate("tipoLavado", "titulo descripcion precio");
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

const notificar = async (req, res, next) => {
  try {
    const { id } = req.params;

    const lavado = await LavadosModel.findById(id)
      .populate("lavador", "nombre dni mail")
      .populate("clienteId", "nombre dni mail celular")
      .populate("vehiculoId", "marca modelo matricula color tipo")
      .populate("tipoLavado", "titulo descripcion precio");

    if (!lavado) {
      return res.status(404).send({ error: "Lavado no encontrado" });
    }

    const cliente = lavado.clienteId;
    const vehiculo = lavado.vehiculoId;

    const client = getClient();
    if (!client) {
      return res.status(500).send({ error: "Venom client not initialized" });
    }

    try {
      const result = await client.sendText(
        `54${cliente.celular}@c.us`,
        `Hola ${cliente.nombre}, tu vehículo ${vehiculo.marca} ${vehiculo.modelo} - ${vehiculo.matricula} está listo para retirarlo.\n Gracias por confiar en nosotros! \nCARLAUNDRY `
      );
      console.log("Mensaje wsp enviado:", result);
      if (cliente.mail) {
        const emailSubject = "Tu vehículo está listo";
        const emailText = `Hola ${cliente.nombre},\n\nTu vehículo ${vehiculo.marca} ${vehiculo.modelo} - ${vehiculo.matricula} ya está listo para retirarlo.\n\n Gracias por confiar en nosotros! \nCARLAUNDRY`;
        try {
          const emailResult = await sendEmail(cliente.mail, emailSubject, emailText);
          console.log("Mensaje de correo enviado controler:", emailResult);
        } catch (error) {
          console.error("Error enviando correo 1:", emailError);
        }
      }

      res.status(200).send({ success: "Notificación enviada" });
    } catch (error) {
      console.error("Error enviando mensaje:", error);
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

const getLavadoList = async (req, res, next) => {
  try {
    const allLavados = await LavadosModel.find()
      .populate("lavador", "nombre dni mail")
      .populate("clienteId","nombre dni mail celular",)
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
      .populate("clienteId","nombre dni mail celular",)
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

    if (update.lavador && update.lavador.length > 0) {
      const lavadoActual = await LavadosModel.findById(id).populate("lavador");
      if (lavadoActual) {
        const lavadoresAnteriores = lavadoActual.lavador;
        for (const lavadorAnterior of lavadoresAnteriores) {
          await EmpleadosModel.findByIdAndUpdate(lavadorAnterior._id, {
            $pull: { lavados: id },
          });
        }
      }

      for (const lavadorId of update.lavador) {
        await EmpleadosModel.findByIdAndUpdate(lavadorId, {
          $addToSet: { lavados: id },
        });
      }
    }

    const updateLavado = await LavadosModel.findByIdAndUpdate(
      id,
      {
        $set: update,
      },
      { new: true }
    );

    if (!updateLavado) {
      return res.status(404).send({ error: "Lavado no encontrado" });
    }

    res.status(200).send(updateLavado);
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
};

const findLavadoByDate = async (req, res, next) => {
  try {
    const { fecha } = req.query;

    if (!fecha) {
      return res.status(400).send({ message: "La fecha es obligatoria" });
    }
    const date = new Date(fecha);

    const startOfDay = new Date(date.setUTCHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setUTCHours(23, 59, 59, 999));

    const lavados = await LavadosModel.find({
      horarioInicio: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    })
      .populate("clienteId", "nombre dni mail celular")
      .populate("vehiculoId", "marca modelo matricula color tipo")
      .populate("lavador", "nombre mail celular")
      .populate("tipoLavado", "titulo precio");

    const totalVentas = lavados.reduce((sum, lavado) => sum + lavado.total, 0);

    res.status(200).send([lavados, totalVentas]);
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
  notificar,
};
