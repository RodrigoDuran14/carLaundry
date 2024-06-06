const TiposDeLavadosModel = require('../models/tiposDeLavado.model')

const postTipoLavado = async (req,res,next)=>{
  try {
    const { titulo, descripcion, precio} = req.body;
    
    const newTipoLavado = new TiposDeLavadosModel({
      titulo,
      descripcion,
      precio,
    });
    
    await newTipoLavado.save();
    res.status(201).send(newTipoLavado);
  } catch (error) {
  next(error)  
}
}

module.exports = postTipoLavado