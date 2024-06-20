const EmpleadosModel = require("../models/Empleado.model");
const LavadosModel = require("../models/lavado.model")


const postEmpleado = async (req, res, next) => {
  try {
    const { nombre, dni, mail, celular } = req.body;

    const newEmpleado = new EmpleadosModel({
      nombre,
      dni,
      mail,
      celular,
    });

    await newEmpleado.save()
    res.status(201).send(newEmpleado)
  } catch (error) {
    next(error);
  }
};

const getEmpleadoList = async (req,res,next)=>{
  try {
    const allEmpleados = await EmpleadosModel.find()

    res.status(200).send(allEmpleados)
  } catch (error) {
    next(error)
  }
}

const getEmpleadoById = async (req, res,next) =>{
  try {
    const {id}= req.params
    const empleado = await EmpleadosModel.findById({_id: id}).populate("lavados", "horarioInicio horarioFin total estadoDelLavado")
    //falta agregar que traiga la info de lavados, una vez que se le asigne un lavado
    !empleado ? res.status(404).send() : res.status(200).send(empleado)
  } catch (error) {
    next(error)
  }
}

const findEmpleado = async (req,res,next)=>{
  try {
    const {nombre, dni, mail, celular} = req.query

    let empleadoQuery = {};
    if (nombre) empleadoQuery.nombre = new RegExp(nombre, "i");
    if (mail) empleadoQuery.mail = new RegExp(mail, "i");
    if (dni) empleadoQuery.dni = Number(dni);
    if (celular) empleadoQuery.celular = Number(celular);

    const empleado = await EmpleadosModel.find(empleadoQuery)

    res.status(200).send(empleado)

  } catch (error) {
    next(error)
  }
}

const findEmpleadoByLavadosDate = async (req,res,next)=>{
  try {
    const {horarioInicio, horarioFin, estadoDelLavado} = req.query

    let lavadoQuery = {};
    if (horarioInicio) lavadoQuery.horarioInicio = Date(horarioInicio);
    if (horarioFin) lavadoQuery.horarioFin = new RegExp(horarioFin, "i");
    if (estadoDelLavado) lavadoQuery.estadoDelLavado = new RegExp(estadoDelLavado, "i");

    if (Object.keys(lavadoQuery).length === 0) {
      return res.status(400).send({
        error:
          "Se requiere al menos un parámetro de búsqueda (horario de inicio, horario final o estado del lavado)",
      });
    }

    const lavados = await LavadosModel.find(lavadoQuery);
    const lavadoId = lavados.map((l) => l._id);

    if (lavadoId.length === 0) {
      return res.status(404).send({
        error: "No se encontraron lavados con los parámetros proporcionados",
      });
    }

    const empleados = await EmpleadosModel.find({
      lavados: { $in: lavadoId }

    })
    //.populate("lavados", "horarioInicio horarioFin estadoDelLavado vehiculoId clienteId");

    res.status(200).send(empleados);

  } catch (error) {
    next(error)
  }
}

const updateEmpleado = async (req,res,next)=>{
  try {
    const {id} = req.params
    const update = req.body

    const updateEmpleado = await EmpleadosModel.findByIdAndUpdate(id, {$set: update})

    if(!updateEmpleado){
      return res.status(404).send({error: "Empleado no encontrado"})
    }

    res.status(200).send(update)
  } catch (error) {
    next(error)
  }
}

module.exports = {postEmpleado, getEmpleadoList, getEmpleadoById, findEmpleado, findEmpleadoByLavadosDate, updateEmpleado }
