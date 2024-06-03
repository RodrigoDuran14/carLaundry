const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

const { config } = require("./config");
const router = require("./src/routes/entidad.route");

const app = express();

// middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

//rutas
//app.use('/tarea', router)
app.use("/cliente", router);

//conexion a la db
mongoose
  .connect(config.db_url)
  .then(() => console.log("Conexion con db exitosa"))
  .catch((e) => console.log("Error con db: ", e));

//app escuchando el puerto
app.listen(config.port, () =>
  console.log("Servidor escuchando el puerto ", config.port)
);
