const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

const { config } = require("./config");
const clienteRoutes = require("./src/routes/cliente.route");
const vehiculoRoutes = require("./src/routes/vehiculo.route")
const TiposDeLavadosRoutes = require("./src/routes/tiposLavado.route")

const app = express();

// middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

//rutas
//app.use('/tarea', router)
app.use("/api", clienteRoutes);
app.use("/api", vehiculoRoutes)
app.use("/api", TiposDeLavadosRoutes)


// Middleware de manejo de errores
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).send({ errors });
  }
  res.status(500).send({ error: 'Error interno del servidor' });
});


//conexion a la db
mongoose
  .connect(config.db_url)
  .then(() => console.log("Conexion con db exitosa"))
  .catch((e) => console.log("Error con db: ", e));

//app escuchando el puerto
app.listen(config.port, () =>
  console.log("Servidor escuchando el puerto ", config.port)
);
