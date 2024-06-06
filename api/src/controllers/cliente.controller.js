const ClienteModel = require("../models/cliente.model");
const VehiculosModel = require("../models/vehiculo.model");

const getClientList = async (req, res, next) => {
  try {
    const allClients = await ClienteModel.find().populate('vehiculo','marca modelo matricula tipo')

    res.status(200).send(allClients);
  } catch (error) {
    next(error)
  }
};

const getClientById = async (req,res, next)=>{
  try {
    const {id} = req.params
    const client = await ClienteModel.findById({_id: id}).populate("vehiculo", "marca modelo matricula tipo color")

    !client ? res.status(404).send() : res.status(200).send(client) 

  } catch (error) {
    next(error)
  }
}

const getClientByName = async (req,res,next) =>{

}

const postClient = async (req,res, next)=>{
  try {
    const {nombre, dni, vehiculoId, celular, mail} = req.body

    const vehiculo = await VehiculosModel.findById(vehiculoId)
    if(!vehiculo){
      return res.status(404).send({error: 'vehiculo no encontrado'})
    }

    if(!nombre, !dni, !vehiculo, !celular){
      return res.status(404).send({error: 'Todos los campos son obligatorios'})
    }

    const newClient = new ClienteModel({
      nombre, 
      dni, 
      vehiculo: vehiculoId, 
      celular, 
      mail
    })

    await newClient.save()
    res.status(201).send(newClient)
  } catch (error) {
    next(error)
  }
}

module.exports = { getClientList, getClientById, postClient };
